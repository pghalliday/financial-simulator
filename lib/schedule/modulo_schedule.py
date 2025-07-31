from datetime import date, timedelta
from typing import Set

from lib.schedule.schedule import Schedule


class ModuloSchedule(Schedule):
    child: Schedule
    start_date: date
    modulo: int
    last_checked: date
    cache: Set[date] = set()
    # Setting the initial last position to
    # -1 ensures that the first match after
    # the start date is at position 0 and will
    # match the modulo
    last_position: int = -1

    def __init__(self, child: Schedule, start_date: date, modulo: int):
        self.child = child
        self.start_date = start_date
        self.modulo = modulo
        self.__check_unchecked_date(start_date)

    def __check_unchecked_date(self, unchecked_date: date):
        if self.child.check(unchecked_date):
            # update the position for a match
            self.last_position = (self.last_position + 1) % self.modulo
            if self.last_position == 0:
                # add to the cache if the modulo matches
                self.cache.add(unchecked_date)
        # mark the date as checked
        self.last_checked = unchecked_date

    def check(self, current_date: date) -> bool:
        assert current_date >= self.start_date, 'A ModuloSchedule cannot check a date before its start date'
        # update the cache for all dates up to and including the current date
        if current_date > self.last_checked:
            for unchecked_date in [self.last_checked + timedelta(days=day)
                                   for day
                                   in range(1, (current_date - self.last_checked).days + 1)]:
                self.__check_unchecked_date(unchecked_date)
        # Check if the current date is in the cache
        return current_date in self.cache
