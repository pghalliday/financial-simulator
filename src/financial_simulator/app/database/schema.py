from __future__ import annotations

from typing import List

from sqlalchemy import MetaData, ForeignKey, Table, Column, Integer
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

scenario_entity = Table(
    "scenario_entity",
    Base.metadata,
    Column("scenario_id", Integer, ForeignKey("scenario.id"), primary_key=True),
    Column("entity_id", Integer, ForeignKey("entity.id"), primary_key=True),
)

class Scenario(Base):
    __tablename__ = "scenario"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column()
    description: Mapped[str] = mapped_column()

    entities: Mapped[List[Entity]] = relationship(secondary=scenario_entity, back_populates="scenarios")

    def __repr__(self) -> str:
        return f"Scenario(id={self.id!r}, name={self.name!r}, description={self.description!r})"



class Entity(Base):
    __tablename__ = "entity"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column()
    description: Mapped[str] = mapped_column()

    scenarios: Mapped[List[Scenario]] = relationship(secondary=scenario_entity, back_populates="entities")

    def __repr__(self) -> str:
        return f"Entity(id={self.id!r}, name={self.name!r}, description={self.description!r})"



