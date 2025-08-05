from dataclasses import dataclass
from datetime import date
from typing import TypeVar, Callable

from .provider import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class FunctionProvider(Provider[T]):
    function: Callable[[date], T]

    def get(self, current_date: date) -> T:
        return self.function(current_date)
