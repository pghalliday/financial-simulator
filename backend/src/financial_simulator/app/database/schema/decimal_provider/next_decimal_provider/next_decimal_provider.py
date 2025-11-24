from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .next_decimal_provider_provider import NextDecimalProviderProvider
from ..decimal_provider import DecimalProvider
from ..decimal_provider_type import DecimalProviderType


class NextDecimalProvider(DecimalProvider):
    __tablename__ = DecimalProviderType.NEXT

    id: Mapped[UUID] = mapped_column(ForeignKey("decimal_provider.id"), primary_key=True)

    decimal_providers: Mapped[List[NextDecimalProviderProvider]] = relationship(
        back_populates="next_decimal_provider",
        order_by=NextDecimalProviderProvider.position,
        collection_class=ordering_list("position"),
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "polymorphic_identity": DecimalProviderType.NEXT,
    }
