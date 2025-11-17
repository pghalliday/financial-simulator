from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .schedule import Schedule


class YearlySchedule(Schedule):
    __tablename__ = "yearly_schedule"

    id: Mapped[UUID] = mapped_column(ForeignKey("schedule.id"), primary_key=True)
    month: Mapped[int | None] = mapped_column()
    day: Mapped[int | None] = mapped_column()

    __mapper_args__ = {
        "polymorphic_identity": "yearly_schedule",
    }
