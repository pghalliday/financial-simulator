from decimal import Decimal
from typing import Literal

from financial_simulator.app.database.schema import DecimalValue
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .value import ValueGet, ValuePost, value_model_fields

DecimalValueType = Literal["decimal_value"]


class DecimalValuePost(ValuePost):
    type: DecimalValueType
    value: Decimal | None = None


class DecimalValueGet(ValueGet):
    type: DecimalValueType
    value: Decimal | None


decimal_value_model_mapper = ModelMapper[
    DecimalValue,
    DecimalValueGet,
    DecimalValuePost,
](
    table_model=DecimalValue,
    get_model=DecimalValueGet,
    post_model=DecimalValuePost,
    fields={
        **value_model_fields,
        "value": OrdinaryModelField(),
    },
)
