from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from ..base import (
    BaseWithType,
)

if TYPE_CHECKING:
    from ..provider import ScheduledProvider
    from .all_schedule import AllSchedule
    from .any_schedule import AnySchedule
else:
    ScheduledProvider = "ScheduledProvider"
    AllSchedule = "AllSchedule"
    AnySchedule = "AnySchedule"


class Schedule(BaseWithType):
    __tablename__ = "schedule"

    scheduled_providers: Mapped[List[ScheduledProvider]] = relationship(
        back_populates="schedule",
        cascade="all, delete-orphan",
    )

    all_schedules: Mapped[List[AllSchedule]] = relationship(
        secondary="all_schedule_schedule",
        back_populates="schedules",
    )

    any_schedules: Mapped[List[AnySchedule]] = relationship(
        secondary="any_schedule_schedule",
        back_populates="schedules",
    )

    __mapper_args__ = {
        "polymorphic_identity": "schedule",
        "polymorphic_on": "type",
    }
