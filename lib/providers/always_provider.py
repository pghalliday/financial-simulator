from datetime import date
from typing import TypeVar

from .provider import Provider

T = TypeVar('T')


class AlwaysProvider(Provider[T]):
    value: T

    def __init__(self, value: T) -> None:
        self.value = value

    def get(self, current_date: date) -> T:
        return self.value
