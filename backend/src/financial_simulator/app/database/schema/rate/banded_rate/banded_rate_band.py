from decimal import Decimal
from typing import Optional, TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ...base import BaseWithId

if TYPE_CHECKING:
    from .banded_rate import BandedRate
    from ..rate import Rate
else:
    BandedRate = "BandedRate"
    Rate = "Rate"


class BandedRateBand(BaseWithId):
    __tablename__ = "banded_rate_band"

    banded_rate_id: Mapped[UUID] = mapped_column(ForeignKey("banded_rate.id"))
    position: Mapped[int] = mapped_column()
    size: Mapped[Decimal | None] = mapped_column()
    rate_id: Mapped[UUID | None] = mapped_column(ForeignKey("rate.id"))

    banded_rate: Mapped[BandedRate] = relationship(
        foreign_keys="BandedRateBand.banded_rate_id",
        back_populates="bands",
    )

    rate: Mapped[Optional[Rate]] = relationship(
        foreign_keys="BandedRateBand.rate_id",
        back_populates="banded_rate_bands",
    )
