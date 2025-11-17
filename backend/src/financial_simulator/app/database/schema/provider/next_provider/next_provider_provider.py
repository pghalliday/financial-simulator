from uuid import UUID

from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column


class NextProviderProvider(Base):
    __tablename__ = "next_provider_provider"

    next_provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("next_provider.id"), primary_key=True
    )
    provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("provider.id"), primary_key=True
    )
