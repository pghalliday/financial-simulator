from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from financial_simulator.app.database.schema.provider.provider import Provider


class MergeProvider(Provider):
    __tablename__ = "merge_provider"

    id: Mapped[UUID] = mapped_column(ForeignKey("provider.id"), primary_key=True)

    providers: Mapped[List[Provider]] = relationship(
        secondary="merge_provider_provider",
        back_populates="merge_providers",
    )

    __mapper_args__ = {
        "polymorphic_identity": "merge_provider",
    }
