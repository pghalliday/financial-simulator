from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, relationship

from ..base import Base, HasId, HasName

if TYPE_CHECKING:
    from ..entity import Entity
else:
    Entity = "Entity"


class Scenario(Base, HasId, HasName):
    __tablename__ = "scenario"

    entities: Mapped[List[Entity]] = relationship(
        secondary="scenario_entity", back_populates="scenarios"
    )
