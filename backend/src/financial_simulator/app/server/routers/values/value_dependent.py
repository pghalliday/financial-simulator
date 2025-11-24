from financial_simulator.app.database.schema import Value
from financial_simulator.app.database.schema.value.value_type import ValueType
from financial_simulator.app.server.util.typed_dependent import TypedDependentGet, create_typed_dependent_get_mapper


class ValueDependentGet(TypedDependentGet[ValueType]):
    pass


value_dependent_get_mapper = create_typed_dependent_get_mapper(Value, ValueDependentGet)

