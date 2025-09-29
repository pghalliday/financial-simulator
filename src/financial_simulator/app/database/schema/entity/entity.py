from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, relationship

from financial_simulator.app.database.schema import HasId
from financial_simulator.app.database.schema.base import Base, HasName, HasType

if TYPE_CHECKING:
    from financial_simulator.app.database.schema.scenario import Scenario
else:
    Scenario = "Scenario"


class Entity(Base, HasId, HasName, HasType):
    __tablename__ = "entity"

    scenarios: Mapped[List[Scenario]] = relationship(
        secondary="scenario_entity", back_populates="entities"
    )

    __mapper_args__ = {
        "polymorphic_identity": "entity",
        "polymorphic_on": "type",
    }
