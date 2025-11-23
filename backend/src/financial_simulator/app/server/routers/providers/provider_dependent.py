from financial_simulator.app.database.schema import Provider
from financial_simulator.app.database.schema.provider.provider_type import ProviderType
from financial_simulator.app.server.routers.common.typed_dependent.typed_dependent import TypedDependentGet, create_typed_dependent_get_mapper


class ProviderDependentGet(TypedDependentGet[ProviderType]):
    pass


provider_dependent_get_mapper = create_typed_dependent_get_mapper(Provider, ProviderDependentGet)

