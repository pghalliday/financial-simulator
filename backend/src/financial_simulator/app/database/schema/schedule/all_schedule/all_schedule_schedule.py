from uuid import UUID

from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column


class AllScheduleSchedule(Base):
    __tablename__ = "all_schedule_schedule"

    all_schedule_id: Mapped[UUID] = mapped_column(
        ForeignKey("all_schedule.id"), primary_key=True
    )
    schedule_id: Mapped[UUID] = mapped_column(
        ForeignKey("schedule.id"), primary_key=True
    )
