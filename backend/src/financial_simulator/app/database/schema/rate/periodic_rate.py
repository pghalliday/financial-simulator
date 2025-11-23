from decimal import Decimal
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .rate import Rate
from .rate_type import RateType


class PeriodicRate(Rate):
    __tablename__ = RateType.PERIODIC

    id: Mapped[UUID] = mapped_column(ForeignKey("rate.id"), primary_key=True)
    annual_rate: Mapped[Decimal | None] = mapped_column()
    period_count: Mapped[int | None] = mapped_column()

    __mapper_args__ = {"polymorphic_identity": RateType.PERIODIC}
