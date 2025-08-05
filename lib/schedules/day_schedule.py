from dataclasses import dataclass
from datetime import date

from .schedule import Schedule


@dataclass(frozen=True)
class DaySchedule(Schedule):
    day: date = date.today()

    def check(self, current_date: date) -> bool:
        return current_date == self.day
