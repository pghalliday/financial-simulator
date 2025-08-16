from dataclasses import dataclass, replace
from datetime import date
from typing import TypeVar, Sequence, Self, Tuple

from .provider import Provider
from financial_simulator.schedules import Schedule

T = TypeVar('T')


@dataclass(frozen=True)
class ScheduledProvider(Provider[T]):
    value: T
    schedule: Schedule

    def get(self, current_date: date) -> Tuple[Self, Sequence[T]] | None:
        schedule_and_scheduled = self.schedule.check(current_date)
        if schedule_and_scheduled is None:
            return None
        schedule, scheduled = schedule_and_scheduled
        values = (self.value,) if scheduled else ()
        return replace(self, schedule=schedule), values
