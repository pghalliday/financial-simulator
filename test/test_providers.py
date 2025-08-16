from calendar import JANUARY
from datetime import date, timedelta
from itertools import islice
from typing import Tuple, Generator, TypeVar, Sequence, Mapping

from financial_simulator.core import Provider
from financial_simulator.util.providers import NeverProvider, AlwaysProvider, ScheduledProvider, FunctionProvider, \
    MapProvider, FlatMapProvider, NextProvider, MergeProvider, MergeMapProvider, create_sequence_provider
from financial_simulator.util.schedules import DaySchedule, UntilSchedule

T = TypeVar("T")


def generate(provider: Provider[T], start_date: date) -> Generator[Tuple[date, Sequence[T] | None]]:
    current_date = start_date
    while True:
        if provider is None:
            result = current_date, None
        else:
            provided = provider.get(current_date)
            if provided is None:
                result = current_date, None
                provider = None
            else:
                provider, sequence = provided
                result = current_date, sequence
        yield result
        current_date += timedelta(days=1)


def completed(day: date, completed_from: date | None) -> bool:
    if completed_from is None:
        return False
    return day >= completed_from


def provided(day: date, provided_days: Mapping[date, Sequence[T]], completed_from: date | None) -> Sequence[T] | None:
    return None if completed(day, completed_from) else provided_days[day] if day in provided_days else ()


def check(provider: Provider,
          start_date: date,
          number_of_days: int,
          provided_days: Mapping[date, Sequence[T]],
          completed_from: date | None) -> None:
    days = (start_date + timedelta(days=day) for day in range(number_of_days))
    expected = tuple((day, provided(day, provided_days, completed_from)) for day in days)
    actual = tuple(islice(generate(provider, start_date), number_of_days))
    assert actual == expected


def test_never_provider():
    check(provider=NeverProvider(),
          start_date=date(2021, JANUARY, 1),
          number_of_days=1000,
          provided_days=dict(),
          completed_from=date(2021, JANUARY, 1))


def test_always_provider():
    check(provider=AlwaysProvider('Hi!'),
          start_date=date(2021, JANUARY, 1),
          number_of_days=10,
          provided_days={
              date(2021, JANUARY, 1): ('Hi!',),
              date(2021, JANUARY, 2): ('Hi!',),
              date(2021, JANUARY, 3): ('Hi!',),
              date(2021, JANUARY, 4): ('Hi!',),
              date(2021, JANUARY, 5): ('Hi!',),
              date(2021, JANUARY, 6): ('Hi!',),
              date(2021, JANUARY, 7): ('Hi!',),
              date(2021, JANUARY, 8): ('Hi!',),
              date(2021, JANUARY, 9): ('Hi!',),
              date(2021, JANUARY, 10): ('Hi!',),
          },
          completed_from=None)


def test_scheduled_provider():
    check(provider=ScheduledProvider('Hi!', DaySchedule(date(2021, JANUARY, 5))),
          start_date=date(2021, JANUARY, 1),
          number_of_days=10,
          provided_days={
              date(2021, JANUARY, 5): ('Hi!',),
          },
          completed_from=date(2021, JANUARY, 6))


def test_function_provider():
    check(provider=FunctionProvider(
        lambda current_date: (f'Hi {current_date.strftime("%A")}!',) if current_date < date(2021, JANUARY,
                                                                                            5) else None),
        start_date=date(2021, JANUARY, 1),
        number_of_days=10,
        provided_days={
            date(2021, JANUARY, 1): ('Hi Friday!',),
            date(2021, JANUARY, 2): ('Hi Saturday!',),
            date(2021, JANUARY, 3): ('Hi Sunday!',),
            date(2021, JANUARY, 4): ('Hi Monday!',),
        },
        completed_from=date(2021, JANUARY, 5))


def test_map_provider():
    check(provider=MapProvider(transform=lambda value: (value.upper(), value.lower()),
                               provider=ScheduledProvider('Hi!', DaySchedule(date(2021, JANUARY, 5)))),
          start_date=date(2021, JANUARY, 1),
          number_of_days=10,
          provided_days={
              date(2021, JANUARY, 5): (('HI!', 'hi!'),),
          },
          completed_from=date(2021, JANUARY, 6))


def test_flat_map_provider():
    check(provider=FlatMapProvider(transform=lambda value: (value.upper(), value.lower()),
                                   provider=ScheduledProvider('Hi!', DaySchedule(date(2021, JANUARY, 5)))),
          start_date=date(2021, JANUARY, 1),
          number_of_days=10,
          provided_days={
              date(2021, JANUARY, 5): ('HI!', 'hi!'),
          },
          completed_from=date(2021, JANUARY, 6))


def test_next_provider():
    check(provider=NextProvider(providers=(ScheduledProvider('Hi!', UntilSchedule(date(2021, JANUARY, 4))),
                                           ScheduledProvider('Hello!', UntilSchedule(date(2021, JANUARY, 6))),
                                           ScheduledProvider('I said Hi!', UntilSchedule(date(2021, JANUARY, 10))))),
          start_date=date(2021, JANUARY, 1),
          number_of_days=10,
          provided_days={
              date(2021, JANUARY, 1): ('Hi!',),
              date(2021, JANUARY, 2): ('Hi!',),
              date(2021, JANUARY, 3): ('Hi!',),
              date(2021, JANUARY, 4): ('Hello!',),
              date(2021, JANUARY, 5): ('Hello!',),
              date(2021, JANUARY, 6): ('I said Hi!',),
              date(2021, JANUARY, 7): ('I said Hi!',),
              date(2021, JANUARY, 8): ('I said Hi!',),
              date(2021, JANUARY, 9): ('I said Hi!',),
          },
          completed_from=date(2021, JANUARY, 10))


def test_next_provider_gaps():
    check(provider=NextProvider(providers=(ScheduledProvider('Hi!', DaySchedule(date(2021, JANUARY, 3))),
                                           ScheduledProvider('Hello!', DaySchedule(date(2021, JANUARY, 5))),
                                           ScheduledProvider('I said Hi!', DaySchedule(date(2021, JANUARY, 9))))),
          start_date=date(2021, JANUARY, 1),
          number_of_days=10,
          provided_days={
              date(2021, JANUARY, 3): ('Hi!',),
              date(2021, JANUARY, 5): ('Hello!',),
              date(2021, JANUARY, 9): ('I said Hi!',),
          },
          completed_from=date(2021, JANUARY, 10))


def test_next_provider_empty():
    check(provider=NextProvider(providers=()),
          start_date=date(2021, JANUARY, 1),
          number_of_days=10,
          provided_days=dict(),
          completed_from=date(2021, JANUARY, 1))


def test_merge_provider():
    check(provider=MergeProvider(providers=(ScheduledProvider('Hi!', UntilSchedule(date(2021, JANUARY, 4))),
                                            ScheduledProvider('Hello!', UntilSchedule(date(2021, JANUARY, 6))),
                                            ScheduledProvider('I said Hi!', UntilSchedule(date(2021, JANUARY, 10))))),
          start_date=date(2021, JANUARY, 1),
          number_of_days=10,
          provided_days={
              date(2021, JANUARY, 1): ('Hi!', 'Hello!', 'I said Hi!'),
              date(2021, JANUARY, 2): ('Hi!', 'Hello!', 'I said Hi!'),
              date(2021, JANUARY, 3): ('Hi!', 'Hello!', 'I said Hi!'),
              date(2021, JANUARY, 4): ('Hello!', 'I said Hi!'),
              date(2021, JANUARY, 5): ('Hello!', 'I said Hi!'),
              date(2021, JANUARY, 6): ('I said Hi!',),
              date(2021, JANUARY, 7): ('I said Hi!',),
              date(2021, JANUARY, 8): ('I said Hi!',),
              date(2021, JANUARY, 9): ('I said Hi!',),
          },
          completed_from=date(2021, JANUARY, 10))


def test_merge_provider_gaps():
    check(provider=MergeProvider(providers=(ScheduledProvider('Hi!', DaySchedule(date(2021, JANUARY, 3))),
                                            ScheduledProvider('Hello!', DaySchedule(date(2021, JANUARY, 5))),
                                            ScheduledProvider('I said Hi!', DaySchedule(date(2021, JANUARY, 9))))),
          start_date=date(2021, JANUARY, 1),
          number_of_days=10,
          provided_days={
              date(2021, JANUARY, 3): ('Hi!',),
              date(2021, JANUARY, 5): ('Hello!',),
              date(2021, JANUARY, 9): ('I said Hi!',),
          },
          completed_from=date(2021, JANUARY, 10))


def test_merge_provider_empty():
    check(provider=MergeProvider(providers=()),
          start_date=date(2021, JANUARY, 1),
          number_of_days=10,
          provided_days=dict(),
          completed_from=date(2021, JANUARY, 1))


def test_merge_map_provider():
    start_date = date(2021, JANUARY, 1)
    sequence_days = [start_date + timedelta(days=i) for i in range(10)]
    check(provider=MergeMapProvider(transform=lambda current_date, value: create_sequence_provider(
        {current_date + timedelta(days=1): f'{value}-1',
         current_date + timedelta(days=2): f'{value}-2',
         current_date + timedelta(days=3): f'{value}-3',
         current_date + timedelta(days=4): f'{value}-4'}),
                                    provider=create_sequence_provider(
                                        {day: day.weekday() for day in sequence_days})),
          start_date=start_date,
          number_of_days=15,
          provided_days={
              date(2021, JANUARY, 2): ('4-1',),
              date(2021, JANUARY, 3): ('4-2', '5-1'),
              date(2021, JANUARY, 4): ('4-3', '5-2', '6-1'),
              date(2021, JANUARY, 5): ('4-4', '5-3', '6-2', '0-1'),
              date(2021, JANUARY, 6): ('5-4', '6-3', '0-2', '1-1'),
              date(2021, JANUARY, 7): ('6-4', '0-3', '1-2', '2-1'),
              date(2021, JANUARY, 8): ('0-4', '1-3', '2-2', '3-1'),
              date(2021, JANUARY, 9): ('1-4', '2-3', '3-2', '4-1'),
              date(2021, JANUARY, 10): ('2-4', '3-3', '4-2', '5-1'),
              date(2021, JANUARY, 11): ('3-4', '4-3', '5-2', '6-1'),
              date(2021, JANUARY, 12): ('4-4', '5-3', '6-2'),
              date(2021, JANUARY, 13): ('5-4', '6-3'),
              date(2021, JANUARY, 14): ('6-4',),
          },
          completed_from=date(2021, JANUARY, 15))


def test_merge_map_provider_never():
    check(provider=MergeMapProvider(transform=lambda current_date, value: create_sequence_provider(
        {current_date + timedelta(days=1): f'{value}-1',
         current_date + timedelta(days=2): f'{value}-2',
         current_date + timedelta(days=3): f'{value}-3',
         current_date + timedelta(days=4): f'{value}-4'}),
                                    provider=NeverProvider()),
          start_date=date(2021, JANUARY, 1),
          number_of_days=15,
          provided_days=dict(),
          completed_from=date(2021, JANUARY, 1))


def test_merge_map_provider_empty():
    start_date = date(2021, JANUARY, 1)
    sequence_days = [start_date + timedelta(days=i) for i in range(10)]
    check(provider=MergeMapProvider(transform=lambda current_date, value: NeverProvider(),
                                    provider=create_sequence_provider(
                                        {day: day.weekday() for day in sequence_days})),
          start_date=start_date,
          number_of_days=15,
          provided_days=dict(),
          completed_from=date(2021, JANUARY, 11))


def test_merge_map_provider_gaps():
    check(provider=MergeMapProvider(transform=lambda current_date, value: create_sequence_provider(
        {
            current_date + timedelta(days=3): value / 4,
            current_date + timedelta(days=6): value / 2,
            current_date + timedelta(days=9): value / 4,
        }
    ),
                                    provider=ScheduledProvider(1000, DaySchedule(date(2021, JANUARY, 3)))),
          start_date=date(2021, JANUARY, 1),
          number_of_days=15,
          provided_days={
              date(2021, JANUARY, 6): (250,),
              date(2021, JANUARY, 9): (500,),
              date(2021, JANUARY, 12): (250,),
          },
          completed_from=date(2021, JANUARY, 13))


def test_create_sequence_provider():
    check(provider=create_sequence_provider({date(2021, JANUARY, 5): 200,
                                             date(2021, JANUARY, 9): 100,
                                             date(2021, JANUARY, 12): 300}),
          start_date=date(2021, JANUARY, 1),
          number_of_days=15,
          provided_days={
              date(2021, JANUARY, 5): (200,),
              date(2021, JANUARY, 9): (100,),
              date(2021, JANUARY, 12): (300,),
          },
          completed_from=date(2021, JANUARY, 13))
