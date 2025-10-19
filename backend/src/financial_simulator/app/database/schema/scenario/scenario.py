from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, relationship

from ..base import BaseWithNameAndDescription

if TYPE_CHECKING:
    from ..entity import Entity
else:
    Entity = "Entity"


class Scenario(BaseWithNameAndDescription):
    __tablename__ = "scenario"

    entities: Mapped[List[Entity]] = relationship(
        secondary="scenario_entity", back_populates="scenarios", order_by="Entity.name"
    )
