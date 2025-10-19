from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, relationship

from ..base import BaseWithType

if TYPE_CHECKING:
    from ..scenario import Scenario
else:
    Scenario = "Scenario"


class Entity(BaseWithType):
    __tablename__ = "entity"

    scenarios: Mapped[List[Scenario]] = relationship(
        secondary="scenario_entity", back_populates="entities", order_by="Scenario.name"
    )

    __mapper_args__ = {
        "polymorphic_identity": "entity",
        "polymorphic_on": "type",
    }
