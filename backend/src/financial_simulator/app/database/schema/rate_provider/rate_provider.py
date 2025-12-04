from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from .rate_provider_type import RateProviderType
from ..base import (
    BaseWithType,
)

if TYPE_CHECKING:
    from .merge_rate_provider import MergeRateProviderProvider
    from .next_rate_provider import NextRateProviderProvider
    from ..bank_account import BankAccount
else:
    MergeRateProviderProvider = "MergeRateProviderProvider"
    NextRateProviderProvider = "NextRateProviderProvider"
    BankAccount = "BankAccount"


class RateProvider(BaseWithType):
    __tablename__ = "rate_provider"

    type: Mapped[RateProviderType] = mapped_column()

    merge_rate_providers: Mapped[List[MergeRateProviderProvider]] = relationship(
        back_populates="rate_provider",
        cascade="all, delete-orphan",
    )

    next_rate_providers: Mapped[List[NextRateProviderProvider]] = relationship(
        back_populates="rate_provider",
        cascade="all, delete-orphan",
    )

    bank_account_interest_rate_providers: Mapped[List[BankAccount]] = relationship(
        foreign_keys="BankAccount.interest_rate_provider_id",
        back_populates="interest_rate_provider",
    )

    __mapper_args__ = {
        "polymorphic_on": "type",
    }
