from dataclasses import dataclass
from datetime import date
from typing import TypeVar

from .provider import Provider, Provided
from ..schedules import Schedule, NeverSchedule

T = TypeVar('T')


@dataclass(frozen=True)
class ScheduledProvider(Provider[T]):
    value: T = None
    schedule: Schedule = NeverSchedule()

    def get(self, current_date: date) -> Provided[T]:
        scheduled = self.schedule.check(current_date)
        values = (self.value,) if scheduled.match else ()
        return Provided(values=values,
                        complete=scheduled.complete)
