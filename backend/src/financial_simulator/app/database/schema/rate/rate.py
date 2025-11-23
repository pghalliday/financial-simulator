from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from .rate_type import RateType
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

    type: Mapped[RateType] = mapped_column()

    banded_rate_bands: Mapped[List[BandedRateBand]] = relationship(
        back_populates="rate",
    )

    rate_values: Mapped[List[RateValue]] = relationship(
        back_populates="rate",
    )

    __mapper_args__ = {
        "polymorphic_on": "type",
    }
