from typing import TYPE_CHECKING
from uuid import UUID

from ..provider import Provider
from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .next_provider import NextProvider
else:
    NextProvider = "NextProvider"


class NextProviderProvider(Base):
    __tablename__ = "next_provider_provider"

    next_provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("next_provider.id"), primary_key=True
    )
    provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("provider.id"), primary_key=True
    )
    position: Mapped[int] = mapped_column()

    next_provider: Mapped[NextProvider] = relationship(
        foreign_keys="NextProviderProvider.next_provider_id",
        back_populates="providers",
    )

    provider: Mapped[Provider] = relationship(
        foreign_keys="NextProviderProvider.provider_id",
        back_populates="next_providers",
    )
