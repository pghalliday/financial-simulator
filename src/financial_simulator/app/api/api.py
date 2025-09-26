import logging
from datetime import date
from typing import Sequence, Tuple
from uuid import UUID

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session

from financial_simulator.app.api.init_dummy_days import init_dummy_days
from financial_simulator.app.config import Config
from financial_simulator.app.database.schema import Entity, Scenario
from financial_simulator.lib.entities import Entity as FSEntity

logger = logging.getLogger(__name__)


class API:
    config: Config
    engine: Engine
    days: Sequence[Tuple[date, Sequence[FSEntity]]]

    def __init__(self, config: Config):
        super().__init__()
        self.config = config
        sqlite_file = self.config.database.sqlite_file
        self.engine = create_engine(f"sqlite:///{sqlite_file}")
        self.days = init_dummy_days()

    def get_days(self) -> Sequence[Tuple[date, Sequence[FSEntity]]]:
        return self.days

    def get_scenario(self, scenario_id: UUID) -> Scenario:
        with Session(self.engine) as session:
            return session.get_one(Scenario, scenario_id)

    def list_scenarios(self) -> Sequence[Scenario]:
        with Session(self.engine) as session:
            return session.query(Scenario).all()

    def insert_scenario(self, scenario: Scenario) -> Scenario:
        with Session(self.engine, expire_on_commit=False) as session:
            logger.debug(f"Inserting scenario: {scenario}")
            session.add(scenario)
            session.commit()
            return scenario

    def upsert_scenario(self, scenario: Scenario) -> Scenario:
        with Session(self.engine, expire_on_commit=False) as session:
            merged = session.merge(scenario)
            session.commit()
            return merged

    def delete_scenario(self, scenario: Scenario) -> None:
        with Session(self.engine, expire_on_commit=False) as session:
            session.delete(scenario)
            session.commit()

    def get_entities(self, scenario_id: UUID) -> Sequence[Entity]:
        with Session(self.engine) as session:
            scenario: Scenario = session.get_one(Scenario, scenario_id)
            return scenario.entities

    def get_entity(self, entity_id: UUID) -> Entity:
        with Session(self.engine) as session:
            return session.get_one(Entity, entity_id)

    def list_entities(self) -> Sequence[Entity]:
        with Session(self.engine) as session:
            return session.query(Entity).all()

    def insert_entity(self, entity: Entity) -> Entity:
        with Session(self.engine, expire_on_commit=False) as session:
            logger.debug(f"Inserting entity: {entity}")
            session.add(entity)
            session.commit()
            return entity

    def upsert_entity(self, entity: Entity) -> Entity:
        with Session(self.engine, expire_on_commit=False) as session:
            merged = session.merge(entity)
            session.commit()
            return merged

    def delete_entity(self, entity: Entity) -> None:
        with Session(self.engine, expire_on_commit=False) as session:
            session.delete(entity)
            session.commit()

    def get_scenarios(self, entity_id: UUID) -> Sequence[Scenario]:
        with Session(self.engine) as session:
            entity: Entity = session.get_one(Entity, entity_id)
            return entity.scenarios

    def add_entity_to_scenario(
        self, scenario_id: UUID, entity_id: UUID
    ) -> Tuple[Scenario, Entity]:
        with Session(self.engine, expire_on_commit=False) as session:
            scenario: Scenario = session.get_one(Scenario, scenario_id)
            entity: Entity = session.get_one(Entity, entity_id)
            scenario.entities.append(entity)
            session.commit()
            return scenario, entity

    def remove_entity_from_scenario(
        self, scenario_id: UUID, entity_id: UUID
    ) -> Tuple[Scenario, Entity]:
        with Session(self.engine, expire_on_commit=False) as session:
            scenario: Scenario = session.get_one(Scenario, scenario_id)
            entity: Entity = session.get_one(Entity, entity_id)
            scenario.entities.remove(entity)
            session.commit()
            return scenario, entity
