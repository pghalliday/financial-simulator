from dataclasses import dataclass
from typing import Tuple, Self, Sequence

from financial_simulator.core import Actor
from test_utils.log_action import LogAction
from test_utils.log_event import LogEvent, TICK_EVENT, ACTION_EVENT


@dataclass(frozen=True)
class LogActor(Actor[LogEvent, LogAction]):
    def on_tick(self) -> Tuple[Self, Sequence[LogEvent]]:
        return self, (LogEvent(source=(), name=TICK_EVENT, complete=False),)

    def on_action(self, action: LogAction) -> Tuple[Self, Sequence[LogEvent]]:
        if action.name == TICK_EVENT:
            return self, (LogEvent(source=(), name=ACTION_EVENT, complete=False),)
        return self, tuple[LogEvent]()
