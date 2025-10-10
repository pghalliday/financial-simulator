from dataclasses import dataclass, replace
from datetime import date
from typing import Callable, Generic, Self, Sequence, Tuple, TypeVar

from .provider import Provider

T = TypeVar("T")
U = TypeVar("U")


@dataclass(frozen=True)
class MapProvider(Generic[T, U], Provider[T]):
    transform: Callable[[U], T]
    provider: Provider[U]

    def get(self, current_date: date) -> Tuple[Self, Sequence[T]] | None:
        provided = self.provider.get(current_date)
        if provided is None:
            return None
        provider, sequence = provided
        return replace(self, provider=provider), tuple(
            self.transform(value) for value in sequence
        )
