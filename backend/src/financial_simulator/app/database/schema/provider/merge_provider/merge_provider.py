from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .merge_provider_provider import MergeProviderProvider
from ..provider import Provider


class MergeProvider(Provider):
    __tablename__ = "merge_provider"

    id: Mapped[UUID] = mapped_column(ForeignKey("provider.id"), primary_key=True)

    providers: Mapped[List[Provider]] = relationship(
        secondary="merge_provider_provider",
        back_populates="merge_providers",
        order_by=MergeProviderProvider.position,
        collection_class=ordering_list("position"),
    )

    __mapper_args__ = {
        "polymorphic_identity": "merge_provider",
    }
