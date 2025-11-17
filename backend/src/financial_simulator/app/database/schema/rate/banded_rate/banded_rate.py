from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..rate import Rate
from .banded_rate_band import BandedRateBand


class BandedRate(Rate):
    __tablename__ = "banded_rate"

    id: Mapped[UUID] = mapped_column(ForeignKey("rate.id"), primary_key=True)

    bands: Mapped[List[BandedRateBand]] = relationship(
        order_by=BandedRateBand.position,
        collection_class=ordering_list("position"),
        back_populates="banded_rate",
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {"polymorphic_identity": "banded_rate"}
