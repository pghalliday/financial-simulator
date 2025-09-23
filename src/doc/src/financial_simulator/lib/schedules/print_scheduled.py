from datetime import date, timedelta
from itertools import islice
from typing import Tuple, Generator

from financial_simulator.lib.schedules import Schedule
from financial_simulator.lib.util import format_days, format_day


def generate_schedule_results(initial_date: date, initial_schedule: Schedule) -> Generator[Tuple[date, bool | None]]:
    schedule: Schedule | None = initial_schedule
    current_date = initial_date
    while True:
        if schedule is None:
            result = current_date, None
        else:
            schedule_and_scheduled = schedule.check(current_date)
            if schedule_and_scheduled is None:
                schedule = None
                result = current_date, None
            else:
                schedule, scheduled = schedule_and_scheduled
                result = current_date, scheduled
        yield result
        current_date = current_date + timedelta(days=1)


def print_scheduled(initial_date: date, initial_schedule: Schedule, number_of_days: int) -> None:
    results = tuple(islice(generate_schedule_results(initial_date, initial_schedule), number_of_days))
    completed_at = next((result for result in results if result[1] is None), None)
    scheduled = tuple(result[0] for result in results if result[1])
    print(format_days(scheduled))
    print(f'Completed at: {format_day(completed_at[0]) if completed_at is not None else 'Not completed'}')
