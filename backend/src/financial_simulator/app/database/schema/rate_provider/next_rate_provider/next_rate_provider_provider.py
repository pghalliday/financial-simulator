from typing import TYPE_CHECKING
from uuid import UUID

from ..rate_provider import RateProvider
from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .next_rate_provider import NextRateProvider
else:
    NextRateProvider = "NextRateProvider"


class NextRateProviderProvider(Base):
    __tablename__ = "next_rate_provider_provider"

    next_rate_provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("next_rate_provider.id"), primary_key=True
    )
    rate_provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("rate_provider.id"), primary_key=True
    )
    position: Mapped[int] = mapped_column()

    next_rate_provider: Mapped[NextRateProvider] = relationship(
        foreign_keys="NextRateProviderProvider.next_rate_provider_id",
        back_populates="rate_providers",
    )

    rate_provider: Mapped[RateProvider] = relationship(
        foreign_keys="NextRateProviderProvider.rate_provider_id",
        back_populates="next_rate_providers",
    )
