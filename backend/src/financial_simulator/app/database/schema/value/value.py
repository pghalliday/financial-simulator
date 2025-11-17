from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from ..base import (
    BaseWithType,
)

if TYPE_CHECKING:
    from ..provider import AlwaysProvider, ScheduledProvider
else:
    AlwaysProvider = "AlwaysProvider"
    ScheduledProvider = "ScheduledProvider"


class Value(BaseWithType):
    __tablename__ = "value"

    always_providers: Mapped[List[AlwaysProvider]] = relationship(
        back_populates="value",
        cascade="all, delete-orphan",
    )

    scheduled_providers: Mapped[List[ScheduledProvider]] = relationship(
        back_populates="value",
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "polymorphic_identity": "value",
        "polymorphic_on": "type",
    }
