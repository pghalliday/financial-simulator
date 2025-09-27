from typing import TYPE_CHECKING, List
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .entity import Entity
else:
    Entity = "Entity"


class Scenario(Base):
    __tablename__ = "scenario"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(unique=True)
    description: Mapped[str] = mapped_column()

    entities: Mapped[List[Entity]] = relationship(
        secondary="scenario_entity", back_populates="scenarios"
    )

    def __repr__(self) -> str:
        return f"Scenario(id={self.id!r}, name={self.name!r}, description={self.description!r})"


class ScenarioEntity(Base):
    __tablename__ = "scenario_entity"

    scenario_id: Mapped[UUID] = mapped_column(ForeignKey("scenario.id"), primary_key=True)
    entity_id: Mapped[UUID] = mapped_column(ForeignKey("entity.id"), primary_key=True)
