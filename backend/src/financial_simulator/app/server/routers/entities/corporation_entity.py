from typing import Literal, Union, Sequence

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    CorporationEntity,
    EntityType,
    CorporationEntityBankAccount,
)
from financial_simulator.app.server.routers.bank_accounts.bank_account_dependent import \
    bank_account_dependent_get_mapper
from financial_simulator.app.server.util.collection import Collection
from financial_simulator.app.server.routers.entities.entity import EntityPost, EntityGet, add_entity_model_fields
from financial_simulator.app.server.util.dependent_types import (
    NamedDependentPost,
    NamedDependentGet,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    NamedAssociationModelField,
)
from financial_simulator.app.server.util.query_params import DefaultQueryParams

class CorporationEntityPost(EntityPost):
    type: Literal[EntityType.CORPORATION]
    bank_accounts: Sequence[NamedDependentPost]


class CorporationEntityGet(EntityGet):
    type: Literal[EntityType.CORPORATION]
    bank_accounts: Sequence[NamedDependentGet]


corporation_entity_model_mapper = ModelMapper(
    table_model=CorporationEntity,
    get_model=CorporationEntityGet,
    post_model=CorporationEntityPost,
)
(
    add_entity_model_fields(corporation_entity_model_mapper)
    .field("bank_accounts", NamedAssociationModelField(
        association_field="bank_account",
        get_mapper=bank_account_dependent_get_mapper,
        association_model=CorporationEntityBankAccount,
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
    model_mapper=corporation_entity_model_mapper,
).add_endpoints(
    router=router,
)
