from typing import TYPE_CHECKING, List
from uuid import UUID, uuid4

from sqlalchemy.orm import Mapped, mapped_column, relationship

from financial_simulator.app.database.schema.base import Base

if TYPE_CHECKING:
    from financial_simulator.app.database.schema.scenario import Scenario
else:
    Scenario = "Scenario"


class Entity(Base):
    __tablename__ = "entity"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(unique=True)
    description: Mapped[str] = mapped_column()

    scenarios: Mapped[List[Scenario]] = relationship(
        secondary="scenario_entity", back_populates="entities"
    )

    def __repr__(self) -> str:
        return f"Entity(id={self.id!r}, name={self.name!r}, description={self.description!r})"

