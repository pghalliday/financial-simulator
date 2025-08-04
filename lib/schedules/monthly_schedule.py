from dataclasses import dataclass
from datetime import date

from .schedule import Schedule
from ..utils.date import correct_day_of_the_month


@dataclass(frozen=True)
class MonthlySchedule(Schedule):
    day: int

    def check(self, current_date: date) -> bool:
        return current_date.day == correct_day_of_the_month(self.day, current_date)
