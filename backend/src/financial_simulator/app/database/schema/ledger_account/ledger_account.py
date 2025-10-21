from __future__ import annotations
from typing import List, TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, relationship, mapped_column

from ..base import BaseWithNameAndDescription

if TYPE_CHECKING:
    from ..bank_account import BankAccount
else:
    BankAccount = "BankAccount"



class LedgerAccount(BaseWithNameAndDescription):
    __tablename__ = "ledger_account"

    parent_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("ledger_account.id")
    )
    account_name: Mapped[str]

    __table_args__ = (
        UniqueConstraint("parent_id", "account_name"),
    )

    parent: Mapped[LedgerAccount | None] = relationship(
        back_populates="sub_accounts",
        remote_side="LedgerAccount.id",
    )
    sub_accounts: Mapped[List[LedgerAccount]] = relationship(
        back_populates="parent",
        cascade="all, delete-orphan",
    )
    bank_account_asset_accounts: Mapped[List[BankAccount]] = relationship(
        foreign_keys="BankAccount.asset_account_id",
        back_populates="asset_account",
        cascade="all, delete-orphan",
    )
    bank_account_interest_income_accounts: Mapped[List[BankAccount]] = relationship(
        foreign_keys="BankAccount.interest_income_account_id",
        back_populates="interest_income_account",
        cascade="all, delete-orphan",
    )
    bank_account_interest_receivable_accounts: Mapped[List[BankAccount]] = relationship(
        foreign_keys="BankAccount.interest_receivable_account_id",
        back_populates="interest_receivable_account",
        cascade="all, delete-orphan",
    )
    bank_account_fee_expenses_accounts: Mapped[List[BankAccount]] = relationship(
        foreign_keys="BankAccount.fee_expenses_account_id",
        back_populates="fee_expenses_account",
        cascade="all, delete-orphan",
    )
    bank_account_fees_payable_accounts: Mapped[List[BankAccount]] = relationship(
        foreign_keys="BankAccount.fees_payable_account_id",
        back_populates="fees_payable_account",
        cascade="all, delete-orphan",
    )
