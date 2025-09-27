from decimal import Decimal
from typing import List, Optional
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from financial_simulator.app.database.schema import Base

from .rate import Rate


class BandedRateBand(Base):
    __tablename__ = "banded_rate_band"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    banded_rate_id: Mapped[UUID] = mapped_column(ForeignKey("banded_rate.id"))
    lower_bound: Mapped[Decimal] = mapped_column()
    size: Mapped[Optional[Decimal]] = mapped_column()
    rate_id: Mapped[UUID] = mapped_column(ForeignKey("rate.id"))


class BandedRate(Rate):
    __tablename__ = "banded_rate"

    id: Mapped[UUID] = mapped_column(ForeignKey("rate.id"), primary_key=True)

    bands: Mapped[List[BandedRateBand]] = relationship()

    __mapper_args__ = {"polymorphic_identity": "banded_rate"}
