from dataclasses import dataclass
from datetime import date
from typing import Self, Tuple

from .schedule import Schedule


@dataclass(frozen=True)
class FromSchedule(Schedule):
    from_date: date

    def check(self, current_date: date) -> Tuple[Self, bool] | None:
        return self, current_date >= self.from_date
