from abc import ABCMeta, abstractmethod
from dataclasses import dataclass, replace
from datetime import date
from typing import Tuple, Self, Sequence, TypeVar, Generic

from .action import Action
from .actor import Actor
from .event import Event
from .state import State

E = TypeVar('E', bound=Event)
A = TypeVar('A', bound=Action)
S = TypeVar('S', bound=State)


@dataclass(frozen=True)
class Child(Generic[E, A, S], State[E, A]):
    name: str
    state: S

    def __update_state_and_event_sources(
            self, state_and_events: Tuple[S, Sequence[E]]) -> Tuple[Self, Sequence[E]]:
        return (replace(self, state=state_and_events[0]),
                tuple(replace(event, source=(self.name,) + tuple(event.source))
                      for event
                      in state_and_events[1]))

    def tick(self, current_date: date) -> Tuple[Self, Sequence[E]]:
        return self.__update_state_and_event_sources(self.state.tick(current_date))

    def dispatch(self, action: A) -> Tuple[Self, Sequence[E]]:
        if action.destination and action.destination[0] == self.name:
            return self.__update_state_and_event_sources(
                self.state.dispatch(replace(action,
                                            source=('..',) + tuple(action.source),
                                            destination=action.destination[1:])))
        return self, tuple[E]()


@dataclass(frozen=True)
class Container(Generic[E, A, S], Actor[E, A], metaclass=ABCMeta):
    children: Sequence[Child[E, A, S]]

    @classmethod
    def __map(cls, container_and_events: Tuple[Self, Sequence[E]]) -> Tuple[Self, Sequence[E]]:
        container, events = container_and_events
        return_events = tuple[E]()
        while events:
            mapped_events, actions = container.__on_events(events)
            events = tuple[E]()
            for action in actions:
                container, action_events = container.__on_action(action)
                events = events + tuple(action_events)
            return_events = return_events + tuple(mapped_events)
        return container, return_events

    def __on_events(self, events: Sequence[E]) -> Tuple[Sequence[E], Sequence[A]]:
        event_sequences, action_sequences = zip(*(self.on_event(event) for event in events))
        return tuple(event
                     for event_sequence
                     in event_sequences
                     for event
                     in event_sequence), tuple(action
                                               for action_sequence
                                               in action_sequences
                                               for action
                                               in action_sequence)

    def __unzip(self,
                children_and_events: Sequence[Tuple[S, Sequence[E]]]) -> Tuple[
        Self, Sequence[E]]:
        children, event_sequences = zip(*children_and_events)
        return (replace(self,
                        children=tuple(children)),
                tuple(event
                      for event_sequence
                      in event_sequences
                      for event
                      in event_sequence))

    def __on_tick(self) -> Tuple[Self, Sequence[E]]:
        return self.__unzip(tuple(child.tick(self.current_date) for child in self.children))

    def __on_action(self, action: A) -> Tuple[Self, Sequence[E]]:
        return self.__unzip(tuple(child.dispatch(action) for child in self.children))

    def on_tick(self) -> Tuple[Self, Sequence[E]]:
        return self.__map(self.__on_tick())

    def on_action(self, action: A) -> Tuple[Self, Sequence[E]]:
        return self.__map(self.__on_action(action))

    @abstractmethod
    def on_event(self, event: E) -> Tuple[Sequence[E], Sequence[A]]:
        raise NotImplementedError
