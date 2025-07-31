from datetime import date

from . import Schedule


class RangeSchedule(Schedule):
    from_date: date
    until_date: date

    def __init__(self, from_date: date, until_date: date):
        self.from_date = from_date
        self.until_date = until_date

    def check(self, current_date: date) -> bool:
        return self.from_date <= current_date < self.until_date
