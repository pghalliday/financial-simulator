from datetime import date
from typing import Callable

from lib.schedule.schedule import Schedule


class FilterSchedule(Schedule):
    func: Callable[[date], bool]

    def __init__(self, func: Callable[[date], bool]):
        self.func = func

    def check(self, current_date: date) -> bool:
        return self.func(current_date)
