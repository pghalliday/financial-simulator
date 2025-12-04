from typing import Literal, Sequence, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import IndividualEntity, EntityType
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


class IndividualEntityPost(EntityPost):
    type: Literal[EntityType.INDIVIDUAL]
    bank_accounts: Sequence[ManyToManyReference]


class IndividualEntityGet(EntityGet):
    type: Literal[EntityType.INDIVIDUAL]
    bank_accounts: Sequence[DependentGet]


individual_model_mapper = ModelMapper(
    table_model=IndividualEntity,
    get_model=IndividualEntityGet,
    post_model=IndividualEntityPost,
)
(
    add_entity_model_fields(individual_model_mapper)
    .field("bank_accounts", ManyToManyModelField(
        include_post=True,
        get_mapper=bank_account_dependent_get_mapper,
    ))
)


class IndividualEntityQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return IndividualEntity.name


router = APIRouter(
    prefix="/individual-entities",
    tags=["individual-entities"],
)


Collection(
    query_params_class=IndividualEntityQueryParams,
    model_mapper=individual_model_mapper,
).add_endpoints(
    router=router,
)
