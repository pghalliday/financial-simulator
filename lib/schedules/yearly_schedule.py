from calendar import JANUARY
from dataclasses import dataclass
from datetime import date

from .schedule import Schedule
from ..utils.date import correct_day_of_the_month


@dataclass(frozen=True)
class YearlySchedule(Schedule):
    month: int = JANUARY
    day: int = 1

    def check(self, current_date: date) -> bool:
        if current_date.month == self.month:
            if current_date.day == correct_day_of_the_month(self.day, current_date):
                return True
        return False
