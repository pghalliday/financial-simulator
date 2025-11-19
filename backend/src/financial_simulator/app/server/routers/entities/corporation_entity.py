from typing import Literal

from financial_simulator.app.database.schema import CorporationEntity
from financial_simulator.app.server.routers.entities.entity import EntityPost, EntityGet, add_entity_model_fields
from financial_simulator.app.server.util.model_mapper import ModelMapper

CorporationEntityType = Literal["corporation_entity"]


class CorporationEntityPost(EntityPost):
    type: CorporationEntityType


class CorporationEntityGet(EntityGet):
    type: CorporationEntityType


corporation_model_mapper = ModelMapper(
    table_model=CorporationEntity,
    get_model=CorporationEntityGet,
    post_model=CorporationEntityPost,
)
add_entity_model_fields(corporation_model_mapper)
