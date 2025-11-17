from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .schedule import Schedule


class MonthlySchedule(Schedule):
    __tablename__ = "monthly_schedule"

    id: Mapped[UUID] = mapped_column(ForeignKey("schedule.id"), primary_key=True)
    day: Mapped[int | None] = mapped_column()

    __mapper_args__ = {
        "polymorphic_identity": "monthly_schedule",
    }
