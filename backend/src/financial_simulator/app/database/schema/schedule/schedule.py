from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from ..base import (
    BaseWithType,
)

if TYPE_CHECKING:
    from ..provider import ScheduledProvider
    from .all_schedule import AllScheduleSchedule
    from .any_schedule import AnyScheduleSchedule
else:
    ScheduledProvider = "ScheduledProvider"
    AllScheduleSchedule = "AllScheduleSchedule"
    AnyScheduleSchedule = "AnyScheduleSchedule"


class Schedule(BaseWithType):
    __tablename__ = "schedule"

    scheduled_providers: Mapped[List[ScheduledProvider]] = relationship(
        back_populates="schedule",
        cascade="all, delete-orphan",
    )

    all_schedules: Mapped[List[AllScheduleSchedule]] = relationship(
        back_populates="schedule",
        cascade="all, delete-orphan",
    )

    any_schedules: Mapped[List[AnyScheduleSchedule]] = relationship(
        back_populates="schedule",
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "polymorphic_identity": "schedule",
        "polymorphic_on": "type",
    }
