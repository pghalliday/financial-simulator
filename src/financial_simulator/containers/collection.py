from typing import Tuple, Sequence, TypeVar, Generic

from financial_simulator.core.action import Action
from financial_simulator.core.container import Container
from financial_simulator.core.event import Event
from financial_simulator.core.state import State

T = TypeVar('T', bound=State)


class Collection(Generic[T], Container[T]):
    def on_event(self, event: Event) -> Tuple[Sequence[Event], Sequence[Action]]:
        return (event,), tuple[Action]()
