from datetime import date

from . import Schedule


class UntilSchedule(Schedule):
    until_date: date

    def __init__(self, until_date: date):
        self.until_date = until_date

    def check(self, current_date: date) -> bool:
        return current_date < self.until_date
