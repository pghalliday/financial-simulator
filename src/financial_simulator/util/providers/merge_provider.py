from dataclasses import dataclass, replace
from datetime import date
from typing import TypeVar, Sequence, Self, Tuple

from financial_simulator.core import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class MergeProvider(Provider[T]):
    providers: Sequence[Provider[T]]

    def get(self, current_date: date) -> Tuple[Self, Sequence[T]] | None:
        provided = tuple(provided
                         for provided
                         in (provider.get(current_date)
                             for provider
                             in self.providers)
                         if provided is not None)
        if not provided:
            return None
        providers, sequences = zip(*provided)
        return (replace(self, providers=providers),
                tuple(value
                      for sequence
                      in sequences
                      for value
                      in sequence))
