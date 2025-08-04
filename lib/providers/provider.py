from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from datetime import date
from typing import TypeVar, Generic

T = TypeVar('T')


@dataclass(frozen=True)
class Provider(Generic[T], metaclass=ABCMeta):
    @abstractmethod
    def get(self, current_date: date) -> T:
        raise NotImplementedError
