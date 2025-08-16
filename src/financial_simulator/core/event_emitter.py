from abc import ABCMeta, abstractmethod
from dataclasses import dataclass, replace
from datetime import date
from typing import Tuple, Sequence, Self, TypeVar, Generic

from .action import Action
from .event import Event
from .state import State

E = TypeVar('E', bound=Event)


@dataclass(frozen=True)
class EventEmitter(Generic[E], State[E, Action], metaclass=ABCMeta):
    current_date: date

    def tick(self, current_date: date) -> Tuple[Self, Sequence[E]]:
        state = replace(self, current_date=current_date)
        return state.on_tick()

    def dispatch(self, action: Action) -> Tuple[Self, Sequence[E]]:
        return self, tuple[Event]()

    @abstractmethod
    def on_tick(self) -> Tuple[Self, Sequence[E]]:
        raise NotImplementedError
