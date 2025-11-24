from typing import TYPE_CHECKING, List, Optional
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import BaseWithNameAndDescription
from ..decimal_provider import DecimalProvider
from ..rate_provider import RateProvider
from ..schedule import Schedule

if TYPE_CHECKING:
    from ..entity import CorporationEntity, IndividualEntity
    from ..ledger_account import LedgerAccount
else:
    IndividualEntity = "IndividualEntity"
    CorporationEntity = "CorporationEntity"
    LedgerAccount = "LedgerAccount"


class BankAccount(BaseWithNameAndDescription):
    __tablename__ = "bank_account"

    asset_account_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("ledger_account.id")
    )
    interest_income_account_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("ledger_account.id")
    )
    interest_receivable_account_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("ledger_account.id")
    )
    fee_expenses_account_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("ledger_account.id")
    )
    fees_payable_account_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("ledger_account.id")
    )
    fees_provider_id: Mapped[UUID | None] = mapped_column(ForeignKey("decimal_provider.id"))
    fee_payment_schedule_id: Mapped[UUID | None] = mapped_column(ForeignKey("schedule.id"))
    rate_provider_id: Mapped[UUID | None] = mapped_column(ForeignKey("rate_provider.id"))
    interest_payment_schedule_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("schedule.id")
    )

    asset_account: Mapped[Optional[LedgerAccount]] = relationship(
        back_populates="bank_account_asset_accounts",
        foreign_keys="BankAccount.asset_account_id",
    )
    interest_income_account: Mapped[Optional[LedgerAccount]] = relationship(
        back_populates="bank_account_interest_income_accounts",
        foreign_keys="BankAccount.interest_income_account_id",
    )
    interest_receivable_account: Mapped[Optional[LedgerAccount]] = relationship(
        back_populates="bank_account_interest_receivable_accounts",
        foreign_keys="BankAccount.interest_receivable_account_id",
    )
    fee_expenses_account: Mapped[Optional[LedgerAccount]] = relationship(
        back_populates="bank_account_fee_expenses_accounts",
        foreign_keys="BankAccount.fee_expenses_account_id",
    )
    fees_payable_account: Mapped[Optional[LedgerAccount]] = relationship(
        back_populates="bank_account_fees_payable_accounts",
        foreign_keys="BankAccount.fees_payable_account_id",
    )
    fees_provider: Mapped[DecimalProvider | None] = relationship(
        back_populates="bank_account_fees_providers",
        foreign_keys="BankAccount.fees_provider_id"
    )
    fee_payment_schedule: Mapped[Schedule | None] = relationship(
        back_populates="bank_account_fee_payment_schedules",
        foreign_keys="BankAccount.fee_payment_schedule_id"
    )
    rate_provider: Mapped[RateProvider | None] = relationship(
        back_populates="bank_account_rate_providers",
        foreign_keys="BankAccount.rate_provider_id"
    )
    interest_payment_schedule: Mapped[Schedule | None] = relationship(
        back_populates="bank_account_interest_payment_schedules",
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
