from dataclasses import dataclass
from datetime import date

from .schedule import Schedule, Scheduled


@dataclass(frozen=True)
class FromSchedule(Schedule):
    from_date: date = date.today()

    def check(self, current_date: date) -> Scheduled:
        return Scheduled(match=current_date >= self.from_date,
                         complete=False)
