from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from ..base import (
    BaseWithType,
)

if TYPE_CHECKING:
    from .banded_rate import BandedRateBand
    from ..value import RateValue
else:
    BandedRateBand = "BandedRateBand"
    RateValue = "RateValue"


class Rate(BaseWithType):
    __tablename__ = "rate"

    banded_rate_bands: Mapped[List[BandedRateBand]] = relationship(
        back_populates="rate",
        cascade="all, delete-orphan",
    )

    rate_values: Mapped[List[RateValue]] = relationship(
        back_populates="rate",
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "polymorphic_identity": "rate",
        "polymorphic_on": "type",
    }
