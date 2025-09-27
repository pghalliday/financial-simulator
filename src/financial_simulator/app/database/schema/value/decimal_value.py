from decimal import Decimal
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .value import Value


class DecimalValue(Value):
    __tablename__ = "decimal_value"

    id: Mapped[UUID] = mapped_column(ForeignKey("value.id"), primary_key=True)
    value: Mapped[Decimal] = mapped_column()

    __mapper_args__ = {"polymorphic_identity": "decimal_value"}
