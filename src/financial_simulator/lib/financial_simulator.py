from dataclasses import dataclass
from datetime import date, timedelta
from typing import Iterator, Sequence, Tuple

from financial_simulator.lib.actions import Action, TickAction
from financial_simulator.lib.entities import Entity


@dataclass
class FinancialSimulator(Iterator[Tuple[date, Sequence[Entity]]]):
    current_date: date
    current_entities: Sequence[Entity]

    def __dispatch(self, action: Action) -> Iterator[Action]:
        self.current_entities, action_sequences = zip(
            *(entity.dispatch(action) for entity in self.current_entities)
        )
        return (
            action for action_sequence in action_sequences for action in action_sequence
        )

    def __next__(self) -> Tuple[date, Sequence[Entity]]:
        self.current_date = self.current_date + timedelta(days=1)
        actions = (TickAction(None, self.current_date),)
        while actions:
            actions = tuple(
                action
                for action_iterator in (self.__dispatch(action) for action in actions)
                for action in action_iterator
            )
        return self.current_date, self.current_entities
