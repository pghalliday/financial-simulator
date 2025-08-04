from dataclasses import dataclass
from datetime import date
from typing import Dict

from .schedule import Schedule


@dataclass(frozen=True)
class AllSchedule(Schedule):
    children: Dict[str, Schedule]

    def check(self, current_date: date) -> bool:
        return all([child.check(current_date) for child in self.children.values()])
