from datetime import date

from lib.schedule.schedule import Schedule


class FromSchedule(Schedule):
    from_date: date

    def __init__(self, from_date: date):
        self.from_date = from_date

    def check(self, current_date: date) -> bool:
        return current_date >= self.from_date
