from dataclasses import dataclass
from datetime import date
from types import MappingProxyType
from typing import TypeVar, Mapping

from .provider import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class AnyProvider(Provider[T]):
    providers: Mapping[str, Provider[T]] = MappingProxyType({})

    def get(self, current_date: date) -> T:
        for provider in self.providers.values():
            value = provider.get(current_date)
            if value is not None:
                return value
        return None
