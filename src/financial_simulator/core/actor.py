from abc import ABCMeta, abstractmethod
from dataclasses import dataclass, replace
from datetime import date
from typing import Tuple, Sequence, Self, TypeVar, Generic

from financial_simulator.core.action import Action
from financial_simulator.core.event import Event
from financial_simulator.core.event_emitter import EventEmitter
from financial_simulator.core.state import State

E = TypeVar('E', bound=Event)
A = TypeVar('A', bound=Action)


@dataclass(frozen=True)
class Actor(Generic[E, A], EventEmitter[E], State[E, A], metaclass=ABCMeta):
    action_log: Sequence[Tuple[date, A]]

    def dispatch(self, action: A) -> Tuple[Self, Sequence[E]]:
        state = replace(self, action_log=tuple(self.action_log) + ((self.current_date, action),))
        return state.on_action(action)

    @abstractmethod
    def on_action(self, action: A) -> Tuple[Self, Sequence[E]]:
        raise NotImplementedError
