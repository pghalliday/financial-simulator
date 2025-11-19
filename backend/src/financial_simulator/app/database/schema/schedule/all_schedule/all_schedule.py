from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, relationship, mapped_column

from ..schedule import Schedule
from .all_schedule_schedule import AllScheduleSchedule


class AllSchedule(Schedule):
    __tablename__ = "all_schedule"

    id: Mapped[UUID] = mapped_column(ForeignKey("schedule.id"), primary_key=True)

    schedules: Mapped[List[AllScheduleSchedule]] = relationship(
        back_populates="all_schedule",
        order_by=AllScheduleSchedule.position,
        collection_class=ordering_list("position"),
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "polymorphic_identity": "all_schedule",
    }
