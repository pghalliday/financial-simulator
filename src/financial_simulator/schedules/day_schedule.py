from dataclasses import dataclass
from datetime import date
from typing import Self, Tuple

from .schedule import Schedule


@dataclass(frozen=True)
class DaySchedule(Schedule):
    day: date

    def check(self, current_date: date) -> Tuple[Self, bool] | None:
        if self.day < current_date:
            return None
        return self, self.day == current_date
