from dataclasses import dataclass, replace
from datetime import date
from typing import TypeVar, Sequence, Self, Tuple

from .provider import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class NextProvider(Provider[T]):
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
                next((sequence
                      for sequence
                      in sequences
                      if sequence), ()))
