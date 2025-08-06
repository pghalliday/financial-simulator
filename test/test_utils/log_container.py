from dataclasses import dataclass
from typing import Tuple, Sequence

from financial_simulator.core import Container
from test_utils.log_action import LogAction
from test_utils.log_actor import LogActor
from test_utils.log_event import LogEvent


@dataclass(frozen=True)
class LogContainer(Container[LogEvent, LogAction, LogActor]):
    maps: Sequence[Tuple[str, str]]

    @classmethod
    def __map_event(cls, event: LogEvent, source: str, destination: str) -> Sequence[LogAction]:
        if event.source:
            if event.source[0] == source:
                action = LogAction(source=event.source,
                                   destination=(destination,),
                                   name=event.name)
                return (action,)
        return tuple[LogAction]()

    def on_event(self, event: LogEvent) -> Tuple[Sequence[LogEvent], Sequence[LogAction]]:
        return tuple[LogEvent](), tuple(action
                                        for action_sequence
                                        in
                                        (self.__map_event(event, source, destination)
                                         for source, destination
                                         in self.maps)
                                        for action in
                                        action_sequence)
