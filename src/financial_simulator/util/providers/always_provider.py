from dataclasses import dataclass
from datetime import date
from typing import TypeVar, Sequence, Self, Tuple

from financial_simulator.core import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class AlwaysProvider(Provider[T]):
    value: T

    def get(self, current_date: date) -> Tuple[Self, Sequence[T]] | None:
        return self, (self.value,)
