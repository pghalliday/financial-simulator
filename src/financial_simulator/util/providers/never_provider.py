from dataclasses import dataclass
from datetime import date
from typing import TypeVar, Sequence, Self, Tuple

from financial_simulator.core.provider import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class NeverProvider(Provider[T]):
    def get(self, current_date: date) -> Tuple[Self, Sequence[T]] | None:
        return None
