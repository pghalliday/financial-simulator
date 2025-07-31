from datetime import date
from typing import TypeVar

from .provider import Provider
from ..schedule import Schedule

T = TypeVar('T')


class ScheduledProvider(Provider[T]):
    value: T
    schedule: Schedule

    def __init__(self, value: T, schedule: Schedule) -> None:
        self.value = value
        self.schedule = schedule

    def get(self, current_date: date) -> T:
        return self.value if self.schedule.check(current_date) else None
