from dataclasses import dataclass
from datetime import date
from typing import TypeVar

from .provider import Provider
from ..schedules import Schedule

T = TypeVar('T')


@dataclass(frozen=True)
class ScheduledProvider(Provider[T]):
    value: T
    schedule: Schedule

    def get(self, current_date: date) -> T:
        return self.value if self.schedule.check(current_date) else None
