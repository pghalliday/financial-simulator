from typing import TYPE_CHECKING
from uuid import UUID

from ..provider import Provider
from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .merge_provider import MergeProvider
else:
    MergeProvider = "MergeProvider"


class MergeProviderProvider(Base):
    __tablename__ = "merge_provider_provider"

    merge_provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("merge_provider.id"), primary_key=True
    )
    provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("provider.id"), primary_key=True
    )
    position: Mapped[int] = mapped_column()

    merge_provider: Mapped[MergeProvider] = relationship(
        foreign_keys="MergeProviderProvider.merge_provider_id",
        back_populates="providers",
    )

    provider: Mapped[Provider] = relationship(
        foreign_keys="MergeProviderProvider.provider_id",
        back_populates="merge_providers",
    )
