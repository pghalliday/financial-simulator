from dataclasses import dataclass
from datetime import date
from typing import TypeVar

from .provider import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class AlwaysProvider(Provider[T]):
    value: T

    def get(self, current_date: date) -> T:
        return self.value
