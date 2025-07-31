from datetime import date
from typing import Dict

from lib.schedule.schedule import Schedule


class AllSchedule(Schedule):
    children: Dict[str, Schedule]

    def __init__(self, children: Dict[str, Schedule]):
        self.children = children

    def check(self, current_date: date) -> bool:
        return all([child.check(current_date) for child in self.children.values()])
