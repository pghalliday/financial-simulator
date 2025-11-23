from decimal import Decimal
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .value import Value
from .value_type import ValueType


class DecimalValue(Value):
    __tablename__ = ValueType.DECIMAL

    id: Mapped[UUID] = mapped_column(ForeignKey("value.id"), primary_key=True)
    value: Mapped[Decimal | None] = mapped_column()

    __mapper_args__ = {"polymorphic_identity": ValueType.DECIMAL}
