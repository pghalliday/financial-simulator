from typing import TYPE_CHECKING, List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base, HasId, HasName
from ..ledger_account import LedgerAccount
from ..provider import Provider
from ..schedule import Schedule

if TYPE_CHECKING:
    from ..entity import CorporationEntity, IndividualEntity
else:
    IndividualEntity = "IndividualEntity"
    CorporationEntity = "CorporationEntity"


class BankAccount(Base, HasId, HasName):
    __tablename__ = "bank_account"

    asset_account_id: Mapped[UUID] = mapped_column(
        ForeignKey("ledger_account.id")
    )
    interest_income_account_id: Mapped[UUID] = mapped_column(
        ForeignKey("ledger_account.id")
    )
    interest_receivable_account_id: Mapped[UUID] = mapped_column(
        ForeignKey("ledger_account.id")
    )
    fee_expenses_account_id: Mapped[UUID] = mapped_column(
        ForeignKey("ledger_account.id")
    )
    fees_payable_account_id: Mapped[UUID] = mapped_column(
        ForeignKey("ledger_account.id")
    )
    fees_provider_id: Mapped[UUID] = mapped_column(ForeignKey("provider.id"))
    fee_payment_schedule_id: Mapped[UUID] = mapped_column(ForeignKey("schedule.id"))
    rate_provider_id: Mapped[UUID] = mapped_column(ForeignKey("provider.id"))
    interest_payment_schedule_id: Mapped[UUID] = mapped_column(
        ForeignKey("schedule.id")
    )

    asset_account: Mapped[LedgerAccount] = relationship(
        foreign_keys="BankAccount.asset_account_id",
    )
    interest_income_account: Mapped[LedgerAccount] = relationship(
        foreign_keys="BankAccount.interest_income_account_id",
    )
    interest_receivable_account: Mapped[LedgerAccount] = relationship(
        foreign_keys="BankAccount.interest_receivable_account_id",
    )
    fee_expenses_account: Mapped[LedgerAccount] = relationship(
        foreign_keys="BankAccount.fee_expenses_account_id",
    )
    fees_payable_account: Mapped[LedgerAccount] = relationship(
        foreign_keys="BankAccount.fees_payable_account_id",
    )
    fees_provider: Mapped[Provider] = relationship(
        foreign_keys="BankAccount.fees_provider_id"
    )
    fee_payment_schedule: Mapped[Schedule] = relationship(
        foreign_keys="BankAccount.fee_payment_schedule_id"
    )
    rate_provider: Mapped[Provider] = relationship(
        foreign_keys="BankAccount.rate_provider_id"
    )
    interest_payment_schedule: Mapped[Schedule] = relationship(
        foreign_keys="BankAccount.interest_payment_schedule_id"
    )

    individual_entities: Mapped[List[IndividualEntity]] = relationship(
        secondary="individual_entity_bank_account",
        back_populates="bank_accounts",
    )

    corporation_entities: Mapped[List[CorporationEntity]] = relationship(
        secondary="corporation_entity_bank_account",
        back_populates="bank_accounts",
    )
