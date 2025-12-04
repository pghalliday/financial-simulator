from typing import Literal, Sequence, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import CorporationEntity, EntityType
from financial_simulator.app.server.routers.bank_accounts.bank_account_dependent import \
    bank_account_dependent_get_mapper
from financial_simulator.app.server.util.collection import Collection
from financial_simulator.app.server.util.dependent import DependentGet
from financial_simulator.app.server.routers.entities.entity import EntityPost, EntityGet, add_entity_model_fields
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    ManyToManyReference,
    ManyToManyModelField,
)
from financial_simulator.app.server.util.query_params import DefaultQueryParams


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


class CorporationEntityQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return CorporationEntity.name


router = APIRouter(
    prefix="/corporation-entities",
    tags=["corporation-entities"],
)


Collection(
    query_params_class=CorporationEntityQueryParams,
    model_mapper=corporation_model_mapper,
).add_endpoints(
    router=router,
)
