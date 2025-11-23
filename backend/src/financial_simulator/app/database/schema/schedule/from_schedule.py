from datetime import date
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .schedule import Schedule
from .schedule_type import ScheduleType


class FromSchedule(Schedule):
    __tablename__ = ScheduleType.FROM

    id: Mapped[UUID] = mapped_column(ForeignKey("schedule.id"), primary_key=True)
    from_date: Mapped[date | None] = mapped_column()

    __mapper_args__ = {
        "polymorphic_identity": ScheduleType.FROM,
    }
