from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .next_provider_provider import NextProviderProvider
from ..provider import Provider
from ..provider_type import ProviderType


class NextProvider(Provider):
    __tablename__ = ProviderType.NEXT

    id: Mapped[UUID] = mapped_column(ForeignKey("provider.id"), primary_key=True)

    providers: Mapped[List[NextProviderProvider]] = relationship(
        back_populates="next_provider",
        order_by=NextProviderProvider.position,
        collection_class=ordering_list("position"),
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "polymorphic_identity": ProviderType.NEXT,
    }
