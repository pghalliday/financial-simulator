from dataclasses import dataclass, replace
from datetime import date
from typing import Self, Sequence, Tuple

from .schedule import Schedule


@dataclass(frozen=True)
class AllSchedule(Schedule):
    schedules: Sequence[Schedule]

    def check(self, current_date: date) -> Tuple[Self, bool] | None:
        if not self.schedules:
            return None
        schedules_and_scheduled = tuple(
            schedule.check(current_date) for schedule in self.schedules
        )
        if any(
            schedule_and_scheduled is None
            for schedule_and_scheduled in schedules_and_scheduled
        ):
            return None
        schedules, scheduled = zip(*schedules_and_scheduled)
        return replace(self, schedules=schedules), all(scheduled)
