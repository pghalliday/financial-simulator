from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from ..base import (
    BaseWithType,
)

if TYPE_CHECKING:
    from .merge_provider import MergeProviderProvider
    from .next_provider import NextProviderProvider
else:
    MergeProviderProvider = "MergeProviderProvider"
    NextProviderProvider = "NextProviderProvider"

class Provider(BaseWithType):
    __tablename__ = "provider"

    merge_providers: Mapped[List[MergeProviderProvider]] = relationship(
        back_populates="provider",
        cascade="all, delete-orphan",
    )

    next_providers: Mapped[List[NextProviderProvider]] = relationship(
        back_populates="provider",
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "polymorphic_identity": "provider",
        "polymorphic_on": "type",
    }
