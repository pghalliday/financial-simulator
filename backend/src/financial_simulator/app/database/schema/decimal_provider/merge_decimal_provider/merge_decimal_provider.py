from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .merge_decimal_provider_provider import MergeDecimalProviderProvider
from ..decimal_provider import DecimalProvider
from ..decimal_provider_type import DecimalProviderType


class MergeDecimalProvider(DecimalProvider):
    __tablename__ = DecimalProviderType.MERGE

    id: Mapped[UUID] = mapped_column(ForeignKey("decimal_provider.id"), primary_key=True)

    decimal_providers: Mapped[List[MergeDecimalProviderProvider]] = relationship(
        back_populates="merge_decimal_provider",
        order_by=MergeDecimalProviderProvider.position,
        collection_class=ordering_list("position"),
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "polymorphic_identity": DecimalProviderType.MERGE,
    }
