from dataclasses import dataclass
from datetime import date
from typing import TypeVar

from .provider import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class NeverProvider(Provider[T]):
    def get(self, current_date: date) -> T:
        return None
