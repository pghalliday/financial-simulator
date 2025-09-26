from __future__ import annotations

from typing import List
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, MetaData
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

constraint_naming_conventions = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=constraint_naming_conventions)


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


class ScenarioEntity(Base):
    __tablename__ = "scenario_entity"

    scenario_id: Mapped[UUID] = mapped_column(ForeignKey("scenario.id"), primary_key=True)
    entity_id: Mapped[UUID] = mapped_column(ForeignKey("entity.id"), primary_key=True)

    def __repr__(self) -> str:
        return f"ScenarioEntity(scenario_id={self.scenario_id!r}, entity_id={self.entity_id!r})"
