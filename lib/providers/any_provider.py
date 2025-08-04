from dataclasses import dataclass
from datetime import date
from typing import TypeVar, List

from .provider import Provider

T = TypeVar('T')


@dataclass(frozen=True)
class AnyProvider(Provider[T]):
    providers: List[Provider[T]]

    def get(self, current_date: date) -> T:
        for provider in self.providers:
            value = provider.get(current_date)
            if value is not None:
                return value
        return None
