from dataclasses import dataclass
from datetime import date
from types import MappingProxyType
from typing import TypeVar, Dict, Mapping

from .provider import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class AllProvider(Provider[Dict[str, T]]):
    providers: Mapping[str, Provider[T]] = MappingProxyType({})

    def get(self, current_date: date) -> Dict[str, T]:
        return {k: provider.get(current_date) for k, provider in self.providers.items()}
