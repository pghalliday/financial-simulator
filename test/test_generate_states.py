from datetime import date, timedelta
from itertools import islice

from financial_simulator import generate_states
from test_utils import LogActor, LogEvent, TICK_EVENT

DAY_0 = date(2021, 1, 1)
DAY_1 = DAY_0 + timedelta(days=1)
DAY_2 = DAY_1 + timedelta(days=1)
DAY_3 = DAY_2 + timedelta(days=1)
DAY_4 = DAY_3 + timedelta(days=1)


def test_generate_0_states() -> None:
    assert tuple(islice(generate_states(initial_state=LogActor(DAY_0, ())),
                        0)) == ()


def test_generate_2_states() -> None:
    assert tuple(islice(generate_states(initial_state=LogActor(DAY_0, ())),
                        2)) == ((LogActor(DAY_1, ()), (LogEvent((), False, TICK_EVENT),)),
                                (LogActor(DAY_2, ()), (LogEvent((), False, TICK_EVENT),)),)


def test_generate_4_states() -> None:
    assert tuple(islice(generate_states(initial_state=LogActor(DAY_0, ())),
                        4)) == ((LogActor(DAY_1, ()), (LogEvent((), False, TICK_EVENT),)),
                                (LogActor(DAY_2, ()), (LogEvent((), False, TICK_EVENT),)),
                                (LogActor(DAY_3, ()), (LogEvent((), False, TICK_EVENT),)),
                                (LogActor(DAY_4, ()), (LogEvent((), False, TICK_EVENT),)))


def test_generate_states_2_to_4() -> None:
    assert tuple(islice(generate_states(initial_state=LogActor(DAY_0, ())),
                        2, 4)) == ((LogActor(DAY_3, ()), (LogEvent((), False, TICK_EVENT),)),
                                   (LogActor(DAY_4, ()), (LogEvent((), False, TICK_EVENT),)))
