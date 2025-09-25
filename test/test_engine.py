from dataclasses import dataclass, replace
from datetime import date, timedelta
from itertools import islice
from typing import Tuple, Self, Sequence

from financial_simulator import FinancialSimulator
from financial_simulator.lib.accounting import Books
from financial_simulator.lib.actions import Action, TickAction
from financial_simulator.lib.entities import Entity


@dataclass(frozen=True)
class MockAction(Action):
    target: str
    source: str


@dataclass(frozen=True)
class MockEntity(Entity):
    current_date: date
    target: str
    action_sources: Sequence[str] = ()

    def _on_action(self, action: Action) -> Tuple[Self, Sequence[Action]]:
        if isinstance(action, TickAction):
            return (replace(self,
                            current_date=action.current_date),
                    (MockAction(self.target, self.name),))
        if isinstance(action, MockAction):
            return (replace(self,
                            action_sources=tuple(self.action_sources) + (action.source,)),
                    ())
        return self, ()


INITIAL_DATE = date(2020, 1, 1)
DAY_1 = INITIAL_DATE + timedelta(days=1)
DAY_2 = INITIAL_DATE + timedelta(days=2)
DAY_3 = INITIAL_DATE + timedelta(days=3)
EMPTY_BOOKS = Books.create_empty(INITIAL_DATE)
INITIAL_ENTITIES = (MockEntity('Entity 1', EMPTY_BOOKS, INITIAL_DATE, 'Entity 2'),
                    MockEntity('Entity 2', EMPTY_BOOKS, INITIAL_DATE, 'Entity 3'),
                    MockEntity('Entity 3', EMPTY_BOOKS, INITIAL_DATE, 'Entity 1'))


def test_iterator():
    engine = FinancialSimulator(INITIAL_DATE, INITIAL_ENTITIES)
    assert tuple(islice(engine, 3)) == ((DAY_1, (MockEntity('Entity 1', EMPTY_BOOKS, DAY_1, 'Entity 2', ('Entity 3',)),
                                                 MockEntity('Entity 2', EMPTY_BOOKS, DAY_1, 'Entity 3', ('Entity 1',)),
                                                 MockEntity('Entity 3', EMPTY_BOOKS, DAY_1, 'Entity 1',
                                                            ('Entity 2',)))),
                                        (DAY_2, (MockEntity('Entity 1', EMPTY_BOOKS, DAY_2, 'Entity 2', ('Entity 3',
                                                                                                         'Entity 3')),
                                                 MockEntity('Entity 2', EMPTY_BOOKS, DAY_2, 'Entity 3', ('Entity 1',
                                                                                                         'Entity 1')),
                                                 MockEntity('Entity 3', EMPTY_BOOKS, DAY_2, 'Entity 1', ('Entity 2',
                                                                                                         'Entity 2')))),
                                        (DAY_3, (MockEntity('Entity 1', EMPTY_BOOKS, DAY_3, 'Entity 2', ('Entity 3',
                                                                                                         'Entity 3',
                                                                                                         'Entity 3')),
                                                 MockEntity('Entity 2', EMPTY_BOOKS, DAY_3, 'Entity 3', ('Entity 1',
                                                                                                         'Entity 1',
                                                                                                         'Entity 1')),
                                                 MockEntity('Entity 3', EMPTY_BOOKS, DAY_3, 'Entity 1', ('Entity 2',
                                                                                                         'Entity 2',
                                                                                                         'Entity 2')))))
