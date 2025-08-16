from dataclasses import dataclass, replace
from datetime import date
from typing import Sequence, Self, Tuple

from .schedule import Schedule


@dataclass(frozen=True)
class AnySchedule(Schedule):
    schedules: Sequence[Schedule]

    def check(self, current_date: date) -> Tuple[Self, bool] | None:
        schedules_and_scheduled = tuple(schedule_and_scheduled
                                        for schedule_and_scheduled
                                        in (schedule.check(current_date)
                                            for schedule
                                            in self.schedules)
                                        if schedule_and_scheduled is not None)
        if not schedules_and_scheduled:
            return None
        schedules, scheduled = zip(*schedules_and_scheduled)
        return replace(self, schedules=schedules), any(scheduled)
