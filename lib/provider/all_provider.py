from datetime import date
from typing import TypeVar, Dict

from . import Provider

T = TypeVar('T')


class AllProvider(Provider[Dict[str, T]]):
    providers: Dict[str, Provider[T]]

    def __init__(self, providers: Dict[str, Provider[T]]) -> None:
        self.providers = providers

    def get(self, current_date: date) -> Dict[str, T]:
        return {k: provider.get(current_date) for k, provider in self.providers.items()}
