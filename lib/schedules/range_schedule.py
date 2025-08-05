from dataclasses import dataclass
from datetime import date

from .schedule import Schedule


@dataclass(frozen=True)
class RangeSchedule(Schedule):
    from_date: date = date.today()
    until_date: date = date.today()

    def check(self, current_date: date) -> bool:
        return self.from_date <= current_date < self.until_date
