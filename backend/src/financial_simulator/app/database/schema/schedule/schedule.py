from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from .schedule_type import ScheduleType
from ..base import (
    BaseWithType,
)

if TYPE_CHECKING:
    from ..provider import ScheduledProvider
    from .all_schedule import AllScheduleSchedule
    from .any_schedule import AnyScheduleSchedule
    from ..bank_account import BankAccount
else:
    ScheduledProvider = "ScheduledProvider"
    AllScheduleSchedule = "AllScheduleSchedule"
    AnyScheduleSchedule = "AnyScheduleSchedule"
    BankAccount = "BankAccount"


class Schedule(BaseWithType):
    __tablename__ = "schedule"

    type: Mapped[ScheduleType] = mapped_column()

    scheduled_providers: Mapped[List[ScheduledProvider]] = relationship(
        back_populates="schedule",
        cascade="all, delete-orphan",
    )

    all_schedules: Mapped[List[AllScheduleSchedule]] = relationship(
        back_populates="schedule",
        cascade="all, delete-orphan",
    )
    any_schedules: Mapped[List[AnyScheduleSchedule]] = relationship(
        back_populates="schedule",
        cascade="all, delete-orphan",
    )

    bank_account_fee_payment_schedules: Mapped[List[BankAccount]] = relationship(
        foreign_keys="BankAccount.fee_payment_schedule_id",
        back_populates="fee_payment_schedule",
    )
    bank_account_interest_payment_schedules: Mapped[List[BankAccount]] = relationship(
        foreign_keys="BankAccount.interest_payment_schedule_id",
        back_populates="interest_payment_schedule",
    )

    __mapper_args__ = {
        "polymorphic_on": "type",
    }
