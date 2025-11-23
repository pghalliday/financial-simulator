from financial_simulator.app.database.schema import Entity
from financial_simulator.app.database.schema.entity.entity_type import EntityType
from financial_simulator.app.server.routers.common.typed_dependent.typed_dependent import TypedDependentGet, create_typed_dependent_get_mapper


class EntityDependentGet(TypedDependentGet[EntityType]):
    pass


entity_dependent_get_mapper = create_typed_dependent_get_mapper(Entity, EntityDependentGet)

