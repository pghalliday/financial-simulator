from dataclasses import dataclass
from datetime import date

from .schedule import Schedule


@dataclass(frozen=True)
class DailySchedule(Schedule):
    def check(self, current_date: date) -> bool:
        return True
