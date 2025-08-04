from dataclasses import dataclass
from datetime import date
from typing import Callable

from .schedule import Schedule


@dataclass(frozen=True)
class FilterSchedule(Schedule):
    func: Callable[[date], bool]

    def check(self, current_date: date) -> bool:
        return self.func(current_date)
