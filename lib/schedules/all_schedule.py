from dataclasses import dataclass
from datetime import date
from types import MappingProxyType
from typing import Mapping

from .schedule import Schedule


@dataclass(frozen=True)
class AllSchedule(Schedule):
    children: Mapping[str, Schedule] = MappingProxyType({})

    def check(self, current_date: date) -> bool:
        return all([child.check(current_date) for child in self.children.values()])
