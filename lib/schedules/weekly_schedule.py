from calendar import MONDAY
from dataclasses import dataclass
from datetime import date

from .schedule import Schedule, Scheduled


@dataclass(frozen=True)
class WeeklySchedule(Schedule):
    weekday: int = MONDAY

    def check(self, current_date: date) -> Scheduled:
        return Scheduled(match=current_date.weekday() == self.weekday,
                         complete=False)
