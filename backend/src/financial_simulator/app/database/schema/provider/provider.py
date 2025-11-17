from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from ..base import (
    BaseWithType,
)

if TYPE_CHECKING:
    from .merge_provider import MergeProvider
    from .next_provider import NextProvider
else:
    MergeProvider = "MergeProvider"
    NextProvider = "NextProvider"

class Provider(BaseWithType):
    __tablename__ = "provider"

    merge_providers: Mapped[List[MergeProvider]] = relationship(
        secondary="merge_provider_provider",
        back_populates="providers",
    )

    next_providers: Mapped[List[NextProvider]] = relationship(
        secondary="next_provider_provider",
        back_populates="providers",
    )

    __mapper_args__ = {
        "polymorphic_identity": "provider",
        "polymorphic_on": "type",
    }
