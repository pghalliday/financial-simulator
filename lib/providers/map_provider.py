from dataclasses import dataclass
from datetime import date
from typing import TypeVar, Callable, Generic

from .never_provider import NeverProvider
from .provider import Provider

T = TypeVar('T')
U = TypeVar('U')


@dataclass(frozen=True)
class MapProvider(Generic[T, U], Provider[T]):
    transform: Callable[[U], T]
    provider: Provider[U] = NeverProvider()

    def get(self, current_date: date) -> T:
        value = self.provider.get(current_date)
        if value is not None:
            return self.transform(value)
        return None
