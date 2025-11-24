from financial_simulator.app.database.schema import Scenario
from financial_simulator.app.server.util.dependent import create_dependent_get_mapper

scenario_dependent_get_mapper = create_dependent_get_mapper(Scenario)

