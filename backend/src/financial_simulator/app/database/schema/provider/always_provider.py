from typing import Optional
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .provider import Provider
from ..value import Value


class AlwaysProvider(Provider):
    __tablename__ = "always_provider"

    id: Mapped[UUID] = mapped_column(ForeignKey("provider.id"), primary_key=True)
    value_id: Mapped[UUID | None] = mapped_column(ForeignKey("value.id"))

    value: Mapped[Optional[Value]] = relationship(
        back_populates="always_providers",
    )

    __mapper_args__ = {
        "polymorphic_identity": "always_provider",
    }
