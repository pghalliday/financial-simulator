from datetime import date
from typing import Tuple, Sequence, TypeVar

from financial_simulator.core import Event, EventEmitter

T = TypeVar('T')


def format_day(day: date) -> str:
    return day.strftime("%Y-%m-%d : %a")


def format_days(days: Sequence[date]) -> str:
    return '[' + '\n '.join([format_day(day) for day in days]) + ']'


def format_provided(values: Sequence[Tuple[date, Sequence[T] | None]]) -> str:
    return '[' + '\n '.join([f'{format_day(day)} : {value}' for day, value in values]) + ']'


def format_events(states_and_events: Sequence[Tuple[EventEmitter, Sequence[Event]]]) -> str:
    return '[' + '\n '.join(
        [f'{format_day(provider.current_date)} : {events}' for provider, events in states_and_events]) + ']'
