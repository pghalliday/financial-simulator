from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from .entity_type import EntityType
from ..base import BaseWithType

if TYPE_CHECKING:
    from ..scenario import Scenario
else:
    Scenario = "Scenario"


class Entity(BaseWithType):
    __tablename__ = "entity"

    type: Mapped[EntityType] = mapped_column()

    scenarios: Mapped[List[Scenario]] = relationship(
        secondary="scenario_entity", back_populates="entities", order_by="Scenario.name"
    )

    __mapper_args__ = {
        "polymorphic_on": "type",
    }
