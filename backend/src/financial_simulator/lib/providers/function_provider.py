from dataclasses import dataclass
from datetime import date
from typing import Callable, Self, Sequence, Tuple, TypeVar

from .provider import Provider

T = TypeVar("T")


@dataclass(frozen=True)
class FunctionProvider(Provider[T]):
    function: Callable[[date], Sequence[T] | None]

    def get(self, current_date: date) -> Tuple[Self, Sequence[T]] | None:
        result = self.function(current_date)
        if result is None:
            return None
        return self, result
