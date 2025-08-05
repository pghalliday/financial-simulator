from dataclasses import dataclass
from datetime import date
from types import MappingProxyType
from typing import TypeVar, Mapping

from .provider import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class SequenceProvider(Provider[T]):
    sequence: Mapping[date, T] = MappingProxyType({})

    def get(self, current_date: date) -> T:
        try:
            return self.sequence[current_date]
        except KeyError:
            return None
