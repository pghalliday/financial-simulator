from typing import Literal

from financial_simulator.app.database.schema import CorporationEntity
from financial_simulator.app.server.routers.entities.entity import EntityPost, EntityGet, entity_model_fields
from financial_simulator.app.server.util.model_mapper import ModelMapper

CorporationEntityType = Literal["corporation_entity"]


class CorporationEntityPost(EntityPost):
    type: CorporationEntityType


class CorporationEntityGet(EntityGet):
    type: CorporationEntityType


corporation_model_mapper = ModelMapper[
    CorporationEntity,
    CorporationEntityGet,
    CorporationEntityPost,
](
    table_model=CorporationEntity,
    get_model=CorporationEntityGet,
    post_model=CorporationEntityPost,
    fields=entity_model_fields,
)
