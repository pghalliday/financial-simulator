from decimal import Decimal
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .rate import Rate


class PeriodicRate(Rate):
    id: Mapped[UUID] = mapped_column(ForeignKey("rate.id"), primary_key=True)
    annual_rate: Mapped[Decimal] = mapped_column()
    period_count: Mapped[int] = mapped_column()

    __mapper_args__ = {"polymorphic_identity": "periodic_rate"}
