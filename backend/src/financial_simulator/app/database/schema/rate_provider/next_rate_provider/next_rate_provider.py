from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .next_rate_provider_provider import NextRateProviderProvider
from ..rate_provider import RateProvider
from ..rate_provider_type import RateProviderType


class NextRateProvider(RateProvider):
    __tablename__ = RateProviderType.NEXT

    id: Mapped[UUID] = mapped_column(ForeignKey("rate_provider.id"), primary_key=True)

    rate_providers: Mapped[List[NextRateProviderProvider]] = relationship(
        back_populates="next_rate_provider",
        order_by=NextRateProviderProvider.position,
        collection_class=ordering_list("position"),
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "polymorphic_identity": RateProviderType.NEXT,
    }
