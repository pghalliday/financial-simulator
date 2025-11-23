from financial_simulator.app.database.schema import Rate
from financial_simulator.app.database.schema.rate.rate_type import RateType
from financial_simulator.app.server.routers.common.typed_dependent.typed_dependent import TypedDependentGet, create_typed_dependent_get_mapper


class RateDependentGet(TypedDependentGet[RateType]):
    pass


rate_dependent_get_mapper = create_typed_dependent_get_mapper(Rate, RateDependentGet)

