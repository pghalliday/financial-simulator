from typing import List, TYPE_CHECKING

from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, relationship

from ..base import BaseWithNameAndDescription

if TYPE_CHECKING:
    from ..bank_account import BankAccount
    from .ledger_account_component import LedgerAccountComponent
else:
    BankAccount = "BankAccount"
    LedgerAccountComponent = "LedgerAccountComponent"



class LedgerAccount(BaseWithNameAndDescription):
    __tablename__ = "ledger_account"

    components: Mapped[List[LedgerAccountComponent]] = relationship(
        order_by="LedgerAccountComponent.position",
        collection_class=ordering_list("position"),
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
