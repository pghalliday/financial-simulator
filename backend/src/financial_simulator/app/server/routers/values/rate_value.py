from typing import Literal
from uuid import UUID

from financial_simulator.app.database.schema import RateValue, Rate
from financial_simulator.app.database.schema.value.value_type import ValueType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    ParentModelField,
)
from .value import ValueGet, ValuePost, add_value_model_fields
from financial_simulator.app.server.routers.rates.rate_dependent import (
    RateDependentGet,
    rate_dependent_get_mapper,
)


class RateValuePost(ValuePost):
    type: Literal[ValueType.RATE]
    rate_id: UUID | None = None


class RateValueGet(ValueGet):
    type: Literal[ValueType.RATE]
    rate_id: UUID | None
    rate: RateDependentGet | None


rate_value_model_mapper = ModelMapper(
    table_model=RateValue,
    get_model=RateValueGet,
    post_model=RateValuePost,
)
(
    add_value_model_fields(rate_value_model_mapper)
    .field("rate_id", OptionalRelatedModelField(field="rate", model=Rate))
    .field("rate", ParentModelField(rate_dependent_get_mapper))
)
