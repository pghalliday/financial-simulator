from datetime import date
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .schedule import Schedule


class DaySchedule(Schedule):
    __tablename__ = "day_schedule"

    id: Mapped[UUID] = mapped_column(ForeignKey("schedule.id"), primary_key=True)
    day: Mapped[date | None] = mapped_column()

    __mapper_args__ = {
        "polymorphic_identity": "day_schedule",
    }
