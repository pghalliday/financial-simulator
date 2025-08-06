from dataclasses import dataclass
from datetime import date
from typing import Self, Tuple

from financial_simulator.core.schedule import Schedule


@dataclass(frozen=True)
class DailySchedule(Schedule):
    def check(self, current_date: date) -> Tuple[Self, bool] | None:
        return self, True
