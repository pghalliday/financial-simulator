from typing import Literal

from financial_simulator.app.database.schema import IndividualEntity
from financial_simulator.app.server.routers.entities.entity import EntityPost, EntityGet, add_entity_model_fields
from financial_simulator.app.server.util.model_mapper import ModelMapper

IndividualEntityType = Literal["individual_entity"]


class IndividualEntityPost(EntityPost):
    type: IndividualEntityType


class IndividualEntityGet(EntityGet):
    type: IndividualEntityType


individual_model_mapper = ModelMapper(
    table_model=IndividualEntity,
    get_model=IndividualEntityGet,
    post_model=IndividualEntityPost,
)
add_entity_model_fields(individual_model_mapper)
