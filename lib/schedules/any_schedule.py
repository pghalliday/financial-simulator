from dataclasses import dataclass
from datetime import date
from typing import Dict

from .schedule import Schedule


@dataclass(frozen=True)
class AnySchedule(Schedule):
    children: Dict[str, Schedule]

    def check(self, current_date: date) -> bool:
        return any([child.check(current_date) for child in self.children.values()])
