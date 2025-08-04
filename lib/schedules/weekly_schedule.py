from dataclasses import dataclass
from datetime import date

from .schedule import Schedule


@dataclass(frozen=True)
class WeeklySchedule(Schedule):
    weekday: int

    def check(self, current_date: date) -> bool:
        return current_date.weekday() == self.weekday
