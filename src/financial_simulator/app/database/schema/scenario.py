from typing import TYPE_CHECKING, List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import HasId, HasName, db

if TYPE_CHECKING:
    from .entity import Entity
else:
    Entity = "Entity"


class Scenario(db.Model, HasId, HasName):
    entities: Mapped[List[Entity]] = relationship(
        secondary="scenario_entity", back_populates="scenarios"
    )

    def __repr__(self) -> str:
        return f"Scenario(id={self.id!r}, name={self.name!r}, description={self.description!r})"


class ScenarioEntity(db.Model):
    scenario_id: Mapped[UUID] = mapped_column(
        ForeignKey("scenario.id"), primary_key=True
    )
    entity_id: Mapped[UUID] = mapped_column(ForeignKey("entity.id"), primary_key=True)
