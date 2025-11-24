from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from .decimal_provider_type import DecimalProviderType
from ..base import (
    BaseWithType,
)

if TYPE_CHECKING:
    from .merge_decimal_provider import MergeDecimalProviderProvider
    from .next_decimal_provider import NextDecimalProviderProvider
    from ..bank_account import BankAccount
else:
    MergeDecimalProviderProvider = "MergeDecimalProviderProvider"
    NextDecimalProviderProvider = "NextDecimalProviderProvider"
    BankAccount = "BankAccount"


class DecimalProvider(BaseWithType):
    __tablename__ = "decimal_provider"

    type: Mapped[DecimalProviderType] = mapped_column()

    merge_decimal_providers: Mapped[List[MergeDecimalProviderProvider]] = relationship(
        back_populates="decimal_provider",
        cascade="all, delete-orphan",
    )

    next_decimal_providers: Mapped[List[NextDecimalProviderProvider]] = relationship(
        back_populates="decimal_provider",
        cascade="all, delete-orphan",
    )

    bank_account_fees_providers: Mapped[List[BankAccount]] = relationship(
        foreign_keys="BankAccount.fees_provider_id",
        back_populates="fees_provider",
    )

    __mapper_args__ = {
        "polymorphic_on": "type",
    }
