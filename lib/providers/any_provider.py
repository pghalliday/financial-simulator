from datetime import date
from typing import TypeVar, List

from .provider import Provider

T = TypeVar('T')


class AnyProvider(Provider[T]):
    providers: List[Provider[T]]

    def __init__(self, providers: List[Provider[T]]) -> None:
        self.providers = providers

    def get(self, current_date: date) -> T:
        for provider in self.providers:
            value = provider.get(current_date)
            if value is not None:
                return value
        return None
