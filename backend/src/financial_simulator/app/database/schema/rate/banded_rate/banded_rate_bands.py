from typing import List, Optional, TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .banded_rate_band import BandedRateBand
from ...base import BaseWithId

if TYPE_CHECKING:
    from .banded_rate import BandedRate
    from ..rate import Rate
else:
    BandedRate = "BandedRate"
    Rate = "Rate"


class BandedRateBands(BaseWithId):
    __tablename__ = "banded_rate_bands"

    banded_rate_id: Mapped[UUID] = mapped_column(ForeignKey("banded_rate.id"))
    remainder_rate_id: Mapped[UUID | None] = mapped_column(ForeignKey("rate.id"))

    banded_rate: Mapped[BandedRate] = relationship(
        foreign_keys="BandedRateBands.banded_rate_id",
        back_populates="banded_rate_bands",
        single_parent=True,
    )

    bands: Mapped[List[BandedRateBand]] = relationship(
        order_by=BandedRateBand.position,
        collection_class=ordering_list("position"),
        back_populates="banded_rate_bands",
        cascade="all, delete-orphan",
    )

    remainder_rate: Mapped[Optional[Rate]] = relationship(
        foreign_keys="BandedRateBands.remainder_rate_id",
        back_populates="banded_rate_bands_remainders",
    )
