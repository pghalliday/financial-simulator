from typing import Optional
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .provider import Provider
from .provider_type import ProviderType
from ..value import Value
from ..schedule import Schedule


class ScheduledProvider(Provider):
    __tablename__ = ProviderType.SCHEDULED

    id: Mapped[UUID] = mapped_column(ForeignKey("provider.id"), primary_key=True)
    value_id: Mapped[UUID | None] = mapped_column(ForeignKey("value.id"))
    schedule_id: Mapped[UUID | None] = mapped_column(ForeignKey("schedule.id"))

    value: Mapped[Optional[Value]] = relationship(
        back_populates="scheduled_providers",
    )

    schedule: Mapped[Optional[Schedule]] = relationship(
        back_populates="scheduled_providers",
    )

    __mapper_args__ = {
        "polymorphic_identity": ProviderType.SCHEDULED,
    }
