from typing import Literal
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import RateValue, Rate
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    FieldRelation,
    GetMapper,
    OrdinaryGetField,
    ParentModelField,
)
from .value import ValueGet, ValuePost, value_model_fields

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
    fields={
        "type": OrdinaryGetField(),
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)


rate_value_model_mapper = ModelMapper[
    RateValue,
    RateValueGet,
    RateValuePost,
](
    table_model=RateValue,
    get_model=RateValueGet,
    post_model=RateValuePost,
    fields={
        **value_model_fields,
        "rate_id": OptionalRelatedModelField(
            FieldRelation(field="rate", model=Rate)
        ),
        "rate": ParentModelField(rate_value_rate_get_mapper)
    },
)
