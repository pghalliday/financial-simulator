from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .next_provider_provider import NextProviderProvider
from ..provider import Provider


class NextProvider(Provider):
    __tablename__ = "next_provider"

    id: Mapped[UUID] = mapped_column(ForeignKey("provider.id"), primary_key=True)

    providers: Mapped[List[Provider]] = relationship(
        secondary="next_provider_provider",
        back_populates="next_providers",
        order_by=NextProviderProvider.position,
        collection_class=ordering_list("position"),
    )

    __mapper_args__ = {
        "polymorphic_identity": "next_provider",
    }
