from decimal import Decimal
from typing import Optional
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from ...base import Base, HasId

class BandedRateBand(Base, HasId):
    __tablename__ = "banded_rate_band"

    banded_rate_id: Mapped[UUID] = mapped_column(ForeignKey("banded_rate.id"))
    lower_bound: Mapped[Decimal] = mapped_column()
    size: Mapped[Optional[Decimal]] = mapped_column()
    rate_id: Mapped[UUID] = mapped_column(ForeignKey("rate.id"))
