from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..rate import Rate
from .banded_rate_bands import BandedRateBands
from ..rate_type import RateType


class BandedRate(Rate):
    __tablename__ = RateType.BANDED

    id: Mapped[UUID] = mapped_column(ForeignKey("rate.id"), primary_key=True)

    banded_rate_bands: Mapped[BandedRateBands] = relationship(
        back_populates="banded_rate",
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {"polymorphic_identity": RateType.BANDED}
