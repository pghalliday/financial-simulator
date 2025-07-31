from datetime import date

from lib.schedule.schedule import Schedule


class DailySchedule(Schedule):
    def check(self, current_date: date) -> bool:
        return True
