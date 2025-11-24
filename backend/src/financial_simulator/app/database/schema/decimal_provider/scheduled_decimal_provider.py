from decimal import Decimal
from typing import Optional
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .decimal_provider import DecimalProvider
from .decimal_provider_type import DecimalProviderType
from ..schedule import Schedule


class ScheduledDecimalProvider(DecimalProvider):
    __tablename__ = DecimalProviderType.SCHEDULED

    id: Mapped[UUID] = mapped_column(ForeignKey("decimal_provider.id"), primary_key=True)
    value: Mapped[Decimal | None] = mapped_column()
    schedule_id: Mapped[UUID | None] = mapped_column(ForeignKey("schedule.id"))

    schedule: Mapped[Optional[Schedule]] = relationship(
        back_populates="scheduled_decimal_providers",
    )

    __mapper_args__ = {
        "polymorphic_identity": DecimalProviderType.SCHEDULED,
    }