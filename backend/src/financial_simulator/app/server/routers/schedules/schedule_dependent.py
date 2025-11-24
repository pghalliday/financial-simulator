from financial_simulator.app.database.schema import Schedule
from financial_simulator.app.database.schema.schedule.schedule_type import ScheduleType
from financial_simulator.app.server.util.typed_dependent import TypedDependentGet, create_typed_dependent_get_mapper


class ScheduleDependentGet(TypedDependentGet[ScheduleType]):
    pass


schedule_dependent_get_mapper = create_typed_dependent_get_mapper(Schedule, ScheduleDependentGet)

