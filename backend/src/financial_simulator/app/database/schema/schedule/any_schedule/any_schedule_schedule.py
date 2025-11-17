from uuid import UUID

from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column


class AnyScheduleSchedule(Base):
    __tablename__ = "any_schedule_schedule"

    any_schedule_id: Mapped[UUID] = mapped_column(
        ForeignKey("any_schedule.id"), primary_key=True
    )
    schedule_id: Mapped[UUID] = mapped_column(
        ForeignKey("schedule.id"), primary_key=True
    )
    position: Mapped[int] = mapped_column()
