from dataclasses import dataclass

from financial_simulator.core import Event

TICK_EVENT = 'TICK'
ACTION_EVENT = 'ACTION'


@dataclass(frozen=True)
class LogEvent(Event):
    name: str
