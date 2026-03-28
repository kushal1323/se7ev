from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert as pg_insert
from datetime import datetime, date, timezone
from app.models.models import Transaction, DailySummary, Inventory


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)

def get_today_date() -> date:
    return datetime.now(timezone.utc).date()


def insert_transaction(db: Session, user_id: int, extracted: dict) -> Transaction:
    quantity     = extracted.get("quantity") or 0
    price        = extracted.get("price") or 0
    total_amount = round(quantity * price, 2)

    txn = Transaction(
        user_id      = user_id,
        item_name    = extracted["item_name"],
        quantity     = quantity,
        unit         = extracted.get("unit"),
        price        = price,
        total_amount = total_amount,
        type         = extracted["type"],
    )

    db.add(txn)
    db.flush()
    return txn


def update_inventory_stock(db: Session, user_id: int, extracted: dict) -> None:
    item = (
        db.query(Inventory)
        .filter(
            Inventory.user_id == user_id,
            Inventory.name.ilike(extracted["item_name"])
        )
        .first()
    )

    if item is None:
        return

    quantity = extracted.get("quantity") or 0

    if extracted["type"] == "sale":
        item.stock = max(0, float(item.stock) - quantity)
    elif extracted["type"] == "expense":
        item.stock = float(item.stock) + quantity

    item.updated_at = get_utc_now()
    db.flush()


def upsert_daily_summary(db: Session, user_id: int, extracted: dict) -> None:
    today        = get_today_date()
    total_amount = round(
        (extracted.get("quantity") or 0) * (extracted.get("price") or 0), 2
    )
    is_sale    = extracted["type"] == "sale"
    is_expense = extracted["type"] == "expense"

    stmt = pg_insert(DailySummary).values(
        user_id        = user_id,
        date           = today,
        total_sales    = total_amount if is_sale    else 0,
        total_expenses = total_amount if is_expense else 0,
        profit         = total_amount if is_sale    else -total_amount,
        created_at     = get_utc_now(),
    ).on_conflict_do_update(
        index_elements = ["user_id", "date"],
        set_ = {
            "total_sales":    DailySummary.total_sales    + (total_amount if is_sale    else 0),
            "total_expenses": DailySummary.total_expenses + (total_amount if is_expense else 0),
            "profit":         DailySummary.profit         + (total_amount if is_sale    else -total_amount),
        }
    )

    db.execute(stmt)
    db.flush()


def save_voice_entry(db: Session, user_id: int, extracted: dict) -> Transaction:
    txn = insert_transaction(db, user_id, extracted)
    update_inventory_stock(db, user_id, extracted)
    upsert_daily_summary(db, user_id, extracted)
    db.commit()
    return txn