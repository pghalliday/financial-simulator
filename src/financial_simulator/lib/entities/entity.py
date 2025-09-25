from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import Self, Sequence, Tuple

from financial_simulator.lib.accounting import Books
from financial_simulator.lib.actions import Action


@dataclass(frozen=True)
class Entity(metaclass=ABCMeta):
    name: str
    books: Books

    def dispatch(self, action: Action) -> Tuple[Self, Sequence[Action]]:
        if action.target is None or action.target == self.name:
            return self._on_action(action)
        return self, ()

    @abstractmethod
    def _on_action(self, action: Action) -> Tuple[Self, Sequence[Action]]:
        raise NotImplementedError
