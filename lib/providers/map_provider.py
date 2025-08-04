from dataclasses import dataclass
from datetime import date
from typing import TypeVar, Callable, Generic

from .provider import Provider

T = TypeVar('T')
U = TypeVar('U')


@dataclass(frozen=True)
class MapProvider(Generic[T, U], Provider[T]):
    provider: Provider[U]
    transform: Callable[[U], T]

    def get(self, current_date: date) -> T:
        value = self.provider.get(current_date)
        if value is not None:
            return self.transform(value)
        return None
