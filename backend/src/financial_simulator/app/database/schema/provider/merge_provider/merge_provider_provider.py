from uuid import UUID

from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column


class MergeProviderProvider(Base):
    __tablename__ = "merge_provider_provider"

    merge_provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("merge_provider.id"), primary_key=True
    )
    provider_id: Mapped[UUID] = mapped_column(
        ForeignKey("provider.id"), primary_key=True
    )
