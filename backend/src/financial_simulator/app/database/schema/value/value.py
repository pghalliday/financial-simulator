from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from .value_type import ValueType
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

    type: Mapped[ValueType] = mapped_column()

    always_providers: Mapped[List[AlwaysProvider]] = relationship(
        back_populates="value",
    )

    scheduled_providers: Mapped[List[ScheduledProvider]] = relationship(
        back_populates="value",
    )

    __mapper_args__ = {
        "polymorphic_on": "type",
    }
