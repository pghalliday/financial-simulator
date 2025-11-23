from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .schedule import Schedule
from .schedule_type import ScheduleType


class WeeklySchedule(Schedule):
    __tablename__ = ScheduleType.WEEKLY

    id: Mapped[UUID] = mapped_column(ForeignKey("schedule.id"), primary_key=True)
    weekday: Mapped[int | None] = mapped_column()

    __mapper_args__ = {
        "polymorphic_identity": ScheduleType.WEEKLY,
    }
