from dataclasses import dataclass
from datetime import date
from typing import TypeVar, Dict

from .provider import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class AllProvider(Provider[Dict[str, T]]):
    providers: Dict[str, Provider[T]]

    def get(self, current_date: date) -> Dict[str, T]:
        return {k: provider.get(current_date) for k, provider in self.providers.items()}
