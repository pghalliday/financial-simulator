from datetime import date

from lib.schedule.schedule import Schedule


class NeverSchedule(Schedule):
    def check(self, current_date: date) -> bool:
        return False
