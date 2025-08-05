from dataclasses import dataclass
from datetime import date
from typing import TypeVar

from .provider import Provider
from ..schedules import Schedule, NeverSchedule

T = TypeVar('T')


@dataclass(frozen=True)
class ScheduledProvider(Provider[T]):
    value: T = None
    schedule: Schedule = NeverSchedule()

    def get(self, current_date: date) -> T:
        return self.value if self.schedule.check(current_date) else None
