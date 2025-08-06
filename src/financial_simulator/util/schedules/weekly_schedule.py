from calendar import MONDAY
from dataclasses import dataclass
from datetime import date
from typing import Self, Tuple

from financial_simulator.core.schedule import Schedule


@dataclass(frozen=True)
class WeeklySchedule(Schedule):
    weekday: int

    def check(self, current_date: date) -> Tuple[Self, bool] | None:
        return self, current_date.weekday() == self.weekday
