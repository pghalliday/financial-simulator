from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .schedule import Schedule
from .schedule_type import ScheduleType


class DailySchedule(Schedule):
    __tablename__ = ScheduleType.DAILY

    id: Mapped[UUID] = mapped_column(ForeignKey("schedule.id"), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": ScheduleType.DAILY,
    }
