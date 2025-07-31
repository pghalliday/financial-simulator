from datetime import date

from . import Schedule
from ..utils.date import correct_day_of_the_month


class YearlySchedule(Schedule):
    month: int
    day: int

    def __init__(self, month: int, day: int):
        self.month = month
        self.day = day

    def check(self, current_date: date) -> bool:
        if current_date.month == self.month:
            if current_date.day == correct_day_of_the_month(self.day, current_date):
                return True
        return False
