from dataclasses import dataclass
from datetime import date
from typing import Self, Tuple

from .schedule import Schedule


@dataclass(frozen=True)
class RangeSchedule(Schedule):
    from_date: date
    until_date: date

    def check(self, current_date: date) -> Tuple[Self, bool] | None:
        if current_date >= self.until_date:
            return None
        return self, self.from_date <= current_date < self.until_date
