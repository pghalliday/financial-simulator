from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .merge_provider_provider import MergeProviderProvider
from ..provider import Provider
from ..provider_type import ProviderType


class MergeProvider(Provider):
    __tablename__ = ProviderType.MERGE

    id: Mapped[UUID] = mapped_column(ForeignKey("provider.id"), primary_key=True)

    providers: Mapped[List[MergeProviderProvider]] = relationship(
        back_populates="merge_provider",
        order_by=MergeProviderProvider.position,
        collection_class=ordering_list("position"),
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "polymorphic_identity": ProviderType.MERGE,
    }
