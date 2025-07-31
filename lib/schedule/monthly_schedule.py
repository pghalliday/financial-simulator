from datetime import date

from . import Schedule
from ..utils.date import correct_day_of_the_month


class MonthlySchedule(Schedule):
    day: int

    def __init__(self, day: int):
        self.day = day

    def check(self, current_date: date) -> bool:
        return current_date.day == correct_day_of_the_month(self.day, current_date)
