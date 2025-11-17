from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, relationship, mapped_column

from ..schedule import Schedule
from .any_schedule_schedule import AnyScheduleSchedule


class AnySchedule(Schedule):
    __tablename__ = "any_schedule"

    id: Mapped[UUID] = mapped_column(ForeignKey("schedule.id"), primary_key=True)

    schedules: Mapped[List[Schedule]] = relationship(
        secondary="any_schedule_schedule",
        back_populates="any_schedules",
        order_by=AnyScheduleSchedule.position,
        collection_class=ordering_list("position"),
    )

    __mapper_args__ = {
        "polymorphic_identity": "any_schedule",
    }
