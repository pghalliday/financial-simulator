from dataclasses import dataclass, replace
from datetime import date
from typing import Callable, Generic, Self, Sequence, Tuple, TypeVar

from .provider import Provider

T = TypeVar("T")
U = TypeVar("U")


@dataclass(frozen=True)
class FlatMapProvider(Generic[T, U], Provider[T]):
    transform: Callable[[U], Sequence[T]]
    provider: Provider[U]

    def get(self, current_date: date) -> Tuple[Self, Sequence[T]] | None:
        provided = self.provider.get(current_date)
        if provided is None:
            return None
        provider, u_sequence = provided
        return replace(self, provider=provider), tuple(
            t_value
            for t_sequence in (self.transform(u_value) for u_value in u_sequence)
            for t_value in t_sequence
        )
