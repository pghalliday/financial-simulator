from typing import TYPE_CHECKING
from uuid import UUID

from ..decimal_provider import DecimalProvider
from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .merge_decimal_provider import MergeDecimalProvider
else:
    MergeDecimalProvider = "MergeDecimalProvider"


class MergeDecimalProviderProvider(Base):
    __tablename__ = "merge_decimal_provider_provider"

    merge_decimal_provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("merge_decimal_provider.id"), primary_key=True
    )
    decimal_provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("decimal_provider.id"), primary_key=True
    )
    position: Mapped[int] = mapped_column()

    merge_decimal_provider: Mapped[MergeDecimalProvider] = relationship(
        foreign_keys="MergeDecimalProviderProvider.merge_decimal_provider_id",
        back_populates="decimal_providers",
    )

    decimal_provider: Mapped[DecimalProvider] = relationship(
        foreign_keys="MergeDecimalProviderProvider.decimal_provider_id",
        back_populates="merge_decimal_providers",
    )
