from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .merge_rate_provider_provider import MergeRateProviderProvider
from ..rate_provider import RateProvider
from ..rate_provider_type import RateProviderType


class MergeRateProvider(RateProvider):
    __tablename__ = RateProviderType.MERGE

    id: Mapped[UUID] = mapped_column(ForeignKey("rate_provider.id"), primary_key=True)

    rate_providers: Mapped[List[MergeRateProviderProvider]] = relationship(
        back_populates="merge_rate_provider",
        order_by=MergeRateProviderProvider.position,
        collection_class=ordering_list("position"),
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "polymorphic_identity": RateProviderType.MERGE,
    }
