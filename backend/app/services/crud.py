from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.models.models import Transaction, Inventory, DailySummary, User
from app.schemas.schemas import UserCreate, InventoryCreate, InventoryUpdate


# ─── Users ────────────────────────────────────────────────────────────────────

def create_user(db: Session, data: UserCreate) -> User:
    user = User(**data.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()


# ─── Transactions ─────────────────────────────────────────────────────────────

def get_transactions_by_date(db: Session, user_id: int, target_date: date):
    return (
        db.query(Transaction)
        .filter(
            Transaction.user_id == user_id,
            func.date(Transaction.created_at) == target_date
        )
        .order_by(Transaction.created_at.desc())
        .all()
    )

def get_transactions_by_month(db: Session, user_id: int, month: int, year: int):
    return (
        db.query(Transaction)
        .filter(
            Transaction.user_id == user_id,
            func.extract('month', Transaction.created_at) == month,
            func.extract('year',  Transaction.created_at) == year,
        )
        .order_by(Transaction.created_at.desc())
        .all()
    )

def delete_transaction(db: Session, transaction_id: int, user_id: int) -> bool:
    txn = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == user_id
    ).first()
    if not txn:
        return False
    db.delete(txn)
    db.commit()
    return True


# ─── Inventory ────────────────────────────────────────────────────────────────

def get_inventory(db: Session, user_id: int):
    return db.query(Inventory).filter(Inventory.user_id == user_id).all()

def create_inventory_item(db: Session, user_id: int, data: InventoryCreate) -> Inventory:
    item = Inventory(user_id=user_id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def update_inventory_item(db: Session, item_id: int, user_id: int, data: InventoryUpdate) -> Inventory:
    item = db.query(Inventory).filter(
        Inventory.id == item_id,
        Inventory.user_id == user_id
    ).first()
    if not item:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item

def delete_inventory_item(db: Session, item_id: int, user_id: int) -> bool:
    item = db.query(Inventory).filter(
        Inventory.id == item_id,
        Inventory.user_id == user_id
    ).first()
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True


# ─── Daily Summary ────────────────────────────────────────────────────────────

def get_daily_summary(db: Session, user_id: int, target_date: date) -> DailySummary:
    return db.query(DailySummary).filter(
        DailySummary.user_id == user_id,
        DailySummary.date == target_date
    ).first()

def get_monthly_summaries(db: Session, user_id: int, month: int, year: int):
    return (
        db.query(DailySummary)
        .filter(
            DailySummary.user_id == user_id,
            func.extract('month', DailySummary.date) == month,
            func.extract('year',  DailySummary.date) == year,
        )
        .order_by(DailySummary.date.asc())
        .all()
    )