from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .schedule import Schedule


class DailySchedule(Schedule):
    __tablename__ = "daily_schedule"

    id: Mapped[UUID] = mapped_column(ForeignKey("schedule.id"), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "daily_schedule",
    }
