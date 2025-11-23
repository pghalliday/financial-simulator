from financial_simulator.app.database.schema import Scenario
from financial_simulator.app.server.routers.common.dependent import create_dependent_get_mapper

scenario_dependent_get_mapper = create_dependent_get_mapper(Scenario)

