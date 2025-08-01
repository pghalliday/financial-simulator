from datetime import date

from .schedule import Schedule


class DaySchedule(Schedule):
    day: date

    def __init__(self, day: date):
        self.day = day

    def check(self, current_date: date) -> bool:
        return current_date == self.day
