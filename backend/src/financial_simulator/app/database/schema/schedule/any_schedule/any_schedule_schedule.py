from typing import TYPE_CHECKING
from uuid import UUID

from ..schedule import Schedule
from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .any_schedule import AnySchedule
else:
    AnySchedule = "AnySchedule"


class AnyScheduleSchedule(Base):
    __tablename__ = "any_schedule_schedule"

    any_schedule_id: Mapped[UUID] = mapped_column(
        ForeignKey("any_schedule.id"), primary_key=True
    )
    schedule_id: Mapped[UUID] = mapped_column(
        ForeignKey("schedule.id"), primary_key=True
    )
    position: Mapped[int] = mapped_column()

    any_schedule: Mapped[AnySchedule] = relationship(
        foreign_keys="AnyScheduleSchedule.any_schedule_id",
        back_populates="schedules",
    )

    schedule: Mapped[Schedule] = relationship(
        foreign_keys="AnyScheduleSchedule.schedule_id",
        back_populates="any_schedules",
    )

