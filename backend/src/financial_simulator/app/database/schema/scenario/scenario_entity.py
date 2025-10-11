from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from ..base import Base


class ScenarioEntity(Base):
    __tablename__ = "scenario_entity"

    scenario_id: Mapped[UUID] = mapped_column(ForeignKey("scenario.id"), primary_key=True)
    entity_id: Mapped[UUID] = mapped_column(ForeignKey("entity.id"), primary_key=True)
