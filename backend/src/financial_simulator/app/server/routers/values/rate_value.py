from typing import Literal
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import RateValue, Rate
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    GetMapper,
    OrdinaryGetField,
    ParentModelField,
)
from .value import ValueGet, ValuePost, add_value_model_fields

RateValueType = Literal["rate_value"]


class RateValuePost(ValuePost):
    type: RateValueType
    rate_id: UUID | None = None


class RateValueRateGet(BaseModel):
    id: UUID
    type: str
    name: str
    description: str | None


class RateValueGet(ValueGet):
    type: RateValueType
    rate_id: UUID | None
    rate: RateValueRateGet | None


rate_value_rate_get_mapper = GetMapper(
    table_model=Rate,
    get_model=RateValueRateGet,
)
(
    rate_value_rate_get_mapper
    .field("type", OrdinaryGetField())
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)


rate_value_model_mapper = ModelMapper(
    table_model=RateValue,
    get_model=RateValueGet,
    post_model=RateValuePost,
)
(
    add_value_model_fields(rate_value_model_mapper)
    .field("rate_id", OptionalRelatedModelField(field="rate", model=Rate))
    .field("rate", ParentModelField(rate_value_rate_get_mapper))
)
