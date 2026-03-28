from sqlalchemy import (
    Column, Integer, String, Numeric, Text,
    DateTime, Date, CheckConstraint, UniqueConstraint, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True)
    name          = Column(String(100), nullable=False)
    language      = Column(String(50))
    business_type = Column(String(100))
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    transactions    = relationship("Transaction", back_populates="user")
    daily_summaries = relationship("DailySummary", back_populates="user")
    inventory_items = relationship("Inventory", back_populates="user")


class Transaction(Base):
    __tablename__ = "transactions"

    id           = Column(Integer, primary_key=True)
    user_id      = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    item_name    = Column(String(150), nullable=False)
    quantity     = Column(Numeric(10, 2))
    unit         = Column(String(20))
    price        = Column(Numeric(10, 2))
    total_amount = Column(Numeric(10, 2))
    type         = Column(String(10))
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("type IN ('sale', 'expense')", name="chk_transaction_type"),
    )

    user = relationship("User", back_populates="transactions")


class DailySummary(Base):
    __tablename__ = "daily_summary"

    id             = Column(Integer, primary_key=True)
    user_id        = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    date           = Column(Date, nullable=False)
    total_sales    = Column(Numeric(10, 2), default=0)
    total_expenses = Column(Numeric(10, 2), default=0)
    profit         = Column(Numeric(10, 2), default=0)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "date", name="uq_user_date"),
    )

    user = relationship("User", back_populates="daily_summaries")


class Inventory(Base):
    __tablename__ = "inventory"

    id          = Column(Integer, primary_key=True)
    user_id     = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name        = Column(String(100), nullable=False)
    stock       = Column(Numeric(10, 2), default=0)
    unit        = Column(String(20))
    expiry_date = Column(Date)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="inventory_items")