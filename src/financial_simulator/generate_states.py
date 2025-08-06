from datetime import timedelta
from typing import Generator, Sequence, Tuple

from financial_simulator.core import EventEmitter, Event


def generate_states(initial_state: EventEmitter) -> Generator[Tuple[EventEmitter, Sequence[Event]]]:
    state = initial_state
    while True:
        # We will ignore events at the top level. If they were supposed
        # to be handled, then a container would have dealt with that
        state, events = state.tick(state.current_date + timedelta(days=1))
        yield state, events
