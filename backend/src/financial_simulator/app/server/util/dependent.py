from financial_simulator.app.server.util.model_mapper import (
    GetMapper,
    TABLE,
    OrdinaryGetField,
)

from .dependent_types import DependentGet, NamedDependentGet


def create_dependent_get_mapper(table_model: type[TABLE]) -> GetMapper[TABLE, DependentGet]:
    return (
        GetMapper(
            table_model=table_model,
            get_model=DependentGet,
        )
        .field("name", OrdinaryGetField())
        .field("description", OrdinaryGetField())
    )


def create_named_dependent_get_mapper(table_model: type[TABLE]) -> GetMapper[TABLE, NamedDependentGet]:
    return (
        GetMapper(
            table_model=table_model,
            get_model=NamedDependentGet,
        )
        .field("name", OrdinaryGetField())
        .field("description", OrdinaryGetField())
    )
