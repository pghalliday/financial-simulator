from datetime import date

from .schedule import Schedule


class DailySchedule(Schedule):
    def check(self, current_date: date) -> bool:
        return True
