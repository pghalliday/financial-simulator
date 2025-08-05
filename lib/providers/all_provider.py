from dataclasses import dataclass
from datetime import date
from typing import TypeVar, Sequence

from .provider import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class AllProvider(Provider[Sequence[T]]):
    providers: Sequence[Provider[T]] = ()

    def get(self, current_date: date) -> Sequence[T]:
        return [x
                for x
                in [provider.get(current_date) for provider in self.providers]
                if x is not None]
