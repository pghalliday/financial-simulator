from dataclasses import dataclass
from datetime import date
from typing import Callable, Self, Tuple

from .schedule import Schedule


@dataclass(frozen=True)
class FunctionSchedule(Schedule):
    function: Callable[[date], bool | None]

    def check(self, current_date: date) -> Tuple[Self, bool] | None:
        result = self.function(current_date)
        if result is None:
            return None
        return self, result
