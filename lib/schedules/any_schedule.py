from dataclasses import dataclass
from datetime import date
from typing import Sequence

from .schedule import Schedule


@dataclass(frozen=True)
class AnySchedule(Schedule):
    children: Sequence[Schedule] = ()

    def check(self, current_date: date) -> bool:
        return any([child.check(current_date) for child in self.children])
