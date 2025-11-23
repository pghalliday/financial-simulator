from typing import Literal, Sequence

from financial_simulator.app.database.schema import CorporationEntity
from financial_simulator.app.database.schema.entity.entity_type import EntityType
from financial_simulator.app.server.routers.bank_accounts.bank_account_dependent import \
    bank_account_dependent_get_mapper
from financial_simulator.app.server.routers.common.dependent import DependentGet
from financial_simulator.app.server.routers.entities.entity import EntityPost, EntityGet, add_entity_model_fields
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    ManyToManyReference,
    ManyToManyModelField,
)


class CorporationEntityPost(EntityPost):
    type: Literal[EntityType.CORPORATION]
    bank_accounts: Sequence[ManyToManyReference]


class CorporationEntityGet(EntityGet):
    type: Literal[EntityType.CORPORATION]
    bank_accounts: Sequence[DependentGet]


corporation_model_mapper = ModelMapper(
    table_model=CorporationEntity,
    get_model=CorporationEntityGet,
    post_model=CorporationEntityPost,
)
(
    add_entity_model_fields(corporation_model_mapper)
    .field("bank_accounts", ManyToManyModelField(
        include_post=True,
        get_mapper=bank_account_dependent_get_mapper,
    ))
)
