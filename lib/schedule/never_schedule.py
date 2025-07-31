from datetime import date

from . import Schedule


class NeverSchedule(Schedule):
    def check(self, current_date: date) -> bool:
        return False
