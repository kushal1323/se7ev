from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from decimal import Decimal

# ─── User ─────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    language: Optional[str] = None
    business_type: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    language: Optional[str] = None
    business_type: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ─── Transaction ──────────────────────────────────────────────────────────────

class TransactionCreate(BaseModel):
    item_name: str
    quantity: Decimal
    unit: Optional[str] = None
    price: Decimal
    type: str

class TransactionOut(BaseModel):
    id: int
    user_id: int
    item_name: str
    quantity: Decimal
    unit: Optional[str] = None
    price: Decimal
    total_amount: Decimal
    type: str
    created_at: datetime

    class Config:
        from_attributes = True

# ─── Inventory ────────────────────────────────────────────────────────────────

class InventoryCreate(BaseModel):
    name: str
    stock: Decimal
    unit: Optional[str] = None
    expiry_date: Optional[date] = None

class InventoryUpdate(BaseModel):
    stock: Optional[Decimal] = None
    expiry_date: Optional[date] = None

class InventoryOut(BaseModel):
    id: int
    user_id: int
    name: str
    stock: Decimal
    unit: Optional[str] = None
    expiry_date: Optional[date] = None
    updated_at: datetime

    class Config:
        from_attributes = True

# ─── Daily Summary ────────────────────────────────────────────────────────────

class DailySummaryOut(BaseModel):
    id: int
    user_id: int
    date: date
    total_sales: Decimal
    total_expenses: Decimal
    profit: Decimal

    class Config:
        from_attributes = True