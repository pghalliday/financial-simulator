from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from datetime import date
from typing import Tuple, Self, Sequence, TypeVar, Generic

from .action import Action
from .event import Event

E = TypeVar('E', bound=Event)
A = TypeVar('A', bound=Action)


@dataclass(frozen=True)
class State(Generic[E, A], metaclass=ABCMeta):
    @abstractmethod
    def tick(self, current_date: date) -> Tuple[Self, Sequence[E]]:
        raise NotImplementedError

    @abstractmethod
    def dispatch(self, action: A) -> Tuple[Self, Sequence[E]]:
        raise NotImplementedError
