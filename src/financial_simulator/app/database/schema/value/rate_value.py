from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from financial_simulator.app.database.schema.rate import Rate

from .value import Value


class RateValue(Value):
    __tablename__ = "rate_value"

    id: Mapped[UUID] = mapped_column(ForeignKey("value.id"), primary_key=True)
    rate_id: Mapped[UUID] = mapped_column(ForeignKey("rate.id"))

    rate: Mapped[Rate] = relationship()

    __mapper_args__ = {"polymorphic_identity": "rate_value"}
