from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from datetime import date
from typing import Generic, Self, Sequence, Tuple, TypeVar

T = TypeVar("T")


@dataclass(frozen=True)
class Provider(Generic[T], metaclass=ABCMeta):
    @abstractmethod
    def get(self, current_date: date) -> Tuple[Self, Sequence[T]] | None:
        raise NotImplementedError
