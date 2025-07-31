from datetime import date

from . import Schedule


class WeeklySchedule(Schedule):
    weekday: int

    def __init__(self, weekday: int):
        self.weekday = weekday

    def check(self, current_date: date) -> bool:
        return current_date.weekday() == self.weekday
