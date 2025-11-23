from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from .provider_type import ProviderType
from ..base import (
    BaseWithType,
)

if TYPE_CHECKING:
    from .merge_provider import MergeProviderProvider
    from .next_provider import NextProviderProvider
    from ..bank_account import BankAccount
else:
    MergeProviderProvider = "MergeProviderProvider"
    NextProviderProvider = "NextProviderProvider"
    BankAccount = "BankAccount"


class Provider(BaseWithType):
    __tablename__ = "provider"

    type: Mapped[ProviderType] = mapped_column()

    merge_providers: Mapped[List[MergeProviderProvider]] = relationship(
        back_populates="provider",
        cascade="all, delete-orphan",
    )
    next_providers: Mapped[List[NextProviderProvider]] = relationship(
        back_populates="provider",
        cascade="all, delete-orphan",
    )

    bank_account_fees_providers: Mapped[List[BankAccount]] = relationship(
        foreign_keys="BankAccount.fees_provider_id",
        back_populates="fees_provider",
    )
    bank_account_rate_providers: Mapped[List[BankAccount]] = relationship(
        foreign_keys="BankAccount.rate_provider_id",
        back_populates="rate_provider",
    )

    __mapper_args__ = {
        "polymorphic_on": "type",
    }
