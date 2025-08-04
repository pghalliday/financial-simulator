from dataclasses import dataclass
from datetime import date

from .schedule import Schedule


@dataclass(frozen=True)
class UntilSchedule(Schedule):
    until_date: date

    def check(self, current_date: date) -> bool:
        return current_date < self.until_date
