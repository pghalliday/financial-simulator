from dataclasses import dataclass
from datetime import date

from .schedule import Schedule


@dataclass(frozen=True)
class RangeSchedule(Schedule):
    from_date: date
    until_date: date

    def check(self, current_date: date) -> bool:
        return self.from_date <= current_date < self.until_date
