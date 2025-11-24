from typing import TYPE_CHECKING
from uuid import UUID

from ..rate_provider import RateProvider
from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .merge_rate_provider import MergeRateProvider
else:
    MergeRateProvider = "MergeRateProvider"


class MergeRateProviderProvider(Base):
    __tablename__ = "merge_rate_provider_provider"

    merge_rate_provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("merge_rate_provider.id"), primary_key=True
    )
    rate_provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("rate_provider.id"), primary_key=True
    )
    position: Mapped[int] = mapped_column()

    merge_rate_provider: Mapped[MergeRateProvider] = relationship(
        foreign_keys="MergeRateProviderProvider.merge_rate_provider_id",
        back_populates="rate_providers",
    )

    rate_provider: Mapped[RateProvider] = relationship(
        foreign_keys="MergeRateProviderProvider.rate_provider_id",
        back_populates="merge_rate_providers",
    )
