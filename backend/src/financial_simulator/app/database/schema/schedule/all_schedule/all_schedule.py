from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column

from ..schedule import Schedule


class AllSchedule(Schedule):
    __tablename__ = "all_schedule"

    id: Mapped[UUID] = mapped_column(ForeignKey("schedule.id"), primary_key=True)

    schedules: Mapped[List[Schedule]] = relationship(
        secondary="all_schedule_schedule",
        back_populates="all_schedules",
    )

    __mapper_args__ = {
        "polymorphic_identity": "all_schedule",
    }
