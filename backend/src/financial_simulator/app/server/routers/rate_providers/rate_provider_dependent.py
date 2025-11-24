from financial_simulator.app.database.schema import (
    RateProviderType,
    RateProvider,
)
from financial_simulator.app.server.util.typed_dependent import TypedDependentGet, create_typed_dependent_get_mapper


class RateProviderDependentGet(TypedDependentGet[RateProviderType]):
    pass


rate_provider_dependent_get_mapper = create_typed_dependent_get_mapper(RateProvider, RateProviderDependentGet)
