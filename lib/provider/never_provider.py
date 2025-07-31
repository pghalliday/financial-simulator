from datetime import date
from typing import TypeVar

from . import Provider

T = TypeVar('T')


class NeverProvider(Provider[T]):
    def get(self, current_date: date) -> T:
        return None
