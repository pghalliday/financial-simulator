from typing import Optional
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .rate_provider import RateProvider
from .rate_provider_type import RateProviderType
from ..rate import Rate
from ..schedule import Schedule


class ScheduledRateProvider(RateProvider):
    __tablename__ = RateProviderType.SCHEDULED

    id: Mapped[UUID] = mapped_column(ForeignKey("rate_provider.id"), primary_key=True)
    rate_id: Mapped[UUID | None] = mapped_column(ForeignKey("rate.id"))
    schedule_id: Mapped[UUID | None] = mapped_column(ForeignKey("schedule.id"))

    rate: Mapped[Optional[Rate]] = relationship(
        back_populates="scheduled_rate_providers",
    )

    schedule: Mapped[Optional[Schedule]] = relationship(
        back_populates="scheduled_rate_providers",
    )

    __mapper_args__ = {
        "polymorphic_identity": RateProviderType.SCHEDULED,
    }