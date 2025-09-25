from dataclasses import dataclass
from datetime import date
from typing import Self, Tuple

from financial_simulator.lib.util.date import correct_day_of_the_month

from .schedule import Schedule


@dataclass(frozen=True)
class MonthlySchedule(Schedule):
    day: int

    def check(self, current_date: date) -> Tuple[Self, bool] | None:
        return self, current_date.day == correct_day_of_the_month(
            self.day, current_date
        )
