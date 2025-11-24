from financial_simulator.app.database.schema import DecimalProvider, DecimalProviderType
from financial_simulator.app.server.util.typed_dependent import TypedDependentGet, create_typed_dependent_get_mapper


class DecimalProviderDependentGet(TypedDependentGet[DecimalProviderType]):
    pass


decimal_provider_dependent_get_mapper = create_typed_dependent_get_mapper(DecimalProvider, DecimalProviderDependentGet)

