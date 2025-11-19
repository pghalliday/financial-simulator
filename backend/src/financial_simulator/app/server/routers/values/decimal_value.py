from decimal import Decimal
from typing import Literal

from financial_simulator.app.database.schema import DecimalValue
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .value import ValueGet, ValuePost, add_value_model_fields

DecimalValueType = Literal["decimal_value"]


class DecimalValuePost(ValuePost):
    type: DecimalValueType
    value: Decimal | None = None


class DecimalValueGet(ValueGet):
    type: DecimalValueType
    value: Decimal | None


decimal_value_model_mapper = ModelMapper(
    table_model=DecimalValue,
    get_model=DecimalValueGet,
    post_model=DecimalValuePost,
)
(
    add_value_model_fields(decimal_value_model_mapper)
    .field("value", OrdinaryModelField())
)
