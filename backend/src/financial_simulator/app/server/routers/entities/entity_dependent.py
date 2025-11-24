from financial_simulator.app.database.schema import Entity, EntityType
from financial_simulator.app.server.util.typed_dependent import TypedDependentGet, create_typed_dependent_get_mapper


class EntityDependentGet(TypedDependentGet[EntityType]):
    pass


entity_dependent_get_mapper = create_typed_dependent_get_mapper(Entity, EntityDependentGet)

