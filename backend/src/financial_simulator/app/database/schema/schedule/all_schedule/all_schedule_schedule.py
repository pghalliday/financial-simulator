from typing import TYPE_CHECKING
from uuid import UUID

from ..schedule import Schedule
from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .all_schedule import AllSchedule
else:
    AllSchedule = "AllSchedule"

class AllScheduleSchedule(Base):
    __tablename__ = "all_schedule_schedule"

    all_schedule_id: Mapped[UUID] = mapped_column(
        ForeignKey("all_schedule.id"), primary_key=True
    )
    schedule_id: Mapped[UUID] = mapped_column(
        ForeignKey("schedule.id"), primary_key=True
    )
    position: Mapped[int] = mapped_column()

    all_schedule: Mapped[AllSchedule] = relationship(
        foreign_keys="AllScheduleSchedule.all_schedule_id",
        back_populates="schedules",
    )

    schedule: Mapped[Schedule] = relationship(
        foreign_keys="AllScheduleSchedule.schedule_id",
        back_populates="all_schedules",
    )

