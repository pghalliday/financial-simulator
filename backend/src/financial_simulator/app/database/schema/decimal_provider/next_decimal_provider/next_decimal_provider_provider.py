from typing import TYPE_CHECKING
from uuid import UUID

from ..decimal_provider import DecimalProvider
from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .next_decimal_provider import NextDecimalProvider
else:
    NextDecimalProvider = "NextDecimalProvider"


class NextDecimalProviderProvider(Base):
    __tablename__ = "next_decimal_provider_provider"

    next_decimal_provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("next_decimal_provider.id"), primary_key=True
    )
    decimal_provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("decimal_provider.id"), primary_key=True
    )
    position: Mapped[int] = mapped_column()

    next_decimal_provider: Mapped[NextDecimalProvider] = relationship(
        foreign_keys="NextDecimalProviderProvider.next_decimal_provider_id",
        back_populates="decimal_providers",
    )

    decimal_provider: Mapped[DecimalProvider] = relationship(
        foreign_keys="NextDecimalProviderProvider.decimal_provider_id",
        back_populates="next_decimal_providers",
    )
