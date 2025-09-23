from calendar import JANUARY, TUESDAY, MARCH, FEBRUARY, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, \
    DECEMBER, SATURDAY
from datetime import date, timedelta
from itertools import islice
from typing import Tuple, Generator, Set

from financial_simulator.lib.schedules import Schedule, NeverSchedule, DailySchedule, DaySchedule, MonthlySchedule, \
    WeeklySchedule, YearlySchedule, FromSchedule, UntilSchedule, RangeSchedule, AnySchedule, AllSchedule, \
    FunctionSchedule


def generate(schedule: Schedule, start_date: date) -> Generator[Tuple[date, bool | None]]:
    current_date = start_date
    while True:
        if schedule is None:
            result = current_date, None
        else:
            schedule_and_scheduled = schedule.check(current_date)
            if schedule_and_scheduled is None:
                result = current_date, None
                schedule = None
            else:
                schedule, scheduled = schedule_and_scheduled
                result = current_date, scheduled
        yield result
        current_date += timedelta(days=1)


def completed(day: date, completed_from: date | None) -> bool:
    if completed_from is None:
        return False
    return day >= completed_from


def scheduled(day: date, scheduled_days: Set[date], completed_from: date | None) -> bool | None:
    return None if completed(day, completed_from) else True if day in scheduled_days else False


def check(schedule: Schedule,
          start_date: date,
          number_of_days: int,
          scheduled_days: Set[date],
          completed_from: date | None) -> None:
    days = (start_date + timedelta(days=day) for day in range(number_of_days))
    expected = tuple((day, scheduled(day, scheduled_days, completed_from)) for day in days)
    actual = tuple(islice(generate(schedule, start_date), number_of_days))
    assert actual == expected


def test_never_schedule():
    check(schedule=NeverSchedule(),
          start_date=date(2021, JANUARY, 1),
          number_of_days=1000,
          scheduled_days=set(),
          completed_from=date(2021, JANUARY, 1))


def test_daily_schedule():
    check(schedule=DailySchedule(),
          start_date=date(2021, JANUARY, 1),
          number_of_days=5,
          scheduled_days={
              date(2021, JANUARY, 1),
              date(2021, JANUARY, 2),
              date(2021, JANUARY, 3),
              date(2021, JANUARY, 4),
              date(2021, JANUARY, 5)
          },
          completed_from=None)


def test_weekly_schedule():
    check(schedule=WeeklySchedule(TUESDAY),
          start_date=date(2021, JANUARY, 1),
          number_of_days=15,
          scheduled_days={
              date(2021, JANUARY, 5),
              date(2021, JANUARY, 12),
          },
          completed_from=None)


def test_monthly_schedule():
    # We choose day 30 so we can see what
    # happens on months with 28, 30 and 31 days
    check(schedule=MonthlySchedule(30),
          start_date=date(2021, JANUARY, 1),
          number_of_days=500,
          scheduled_days={
              date(2021, JANUARY, 30),
              date(2021, FEBRUARY, 28),
              date(2021, MARCH, 30),
              date(2021, APRIL, 30),
              date(2021, MAY, 30),
              date(2021, JUNE, 30),
              date(2021, JULY, 30),
              date(2021, AUGUST, 30),
              date(2021, SEPTEMBER, 30),
              date(2021, OCTOBER, 30),
              date(2021, NOVEMBER, 30),
              date(2021, DECEMBER, 30),
              date(2022, JANUARY, 30),
              date(2022, FEBRUARY, 28),
              date(2022, MARCH, 30),
              date(2022, APRIL, 30),
              date(2022, MAY, 30),
              date(2022, JUNE, 30),
          },
          completed_from=None)


def test_yearly_schedule():
    # We choose day 30th February to verify rounding
    check(schedule=YearlySchedule(FEBRUARY, 30),
          start_date=date(2021, JANUARY, 1),
          number_of_days=2000,
          scheduled_days={
              date(2021, FEBRUARY, 28),
              date(2022, FEBRUARY, 28),
              date(2023, FEBRUARY, 28),
              date(2024, FEBRUARY, 29),
              date(2025, FEBRUARY, 28),
              date(2026, FEBRUARY, 28),
          },
          completed_from=None)


def test_day_schedule():
    check(schedule=DaySchedule(date(2021, MARCH, 7)),
          start_date=date(2021, JANUARY, 1),
          number_of_days=1000,
          scheduled_days={
              date(2021, MARCH, 7),
          },
          completed_from=date(2021, MARCH, 8))


def test_from_schedule():
    check(schedule=FromSchedule(date(2021, MARCH, 20)),
          start_date=date(2021, JANUARY, 1),
          number_of_days=90,
          scheduled_days={
              date(2021, MARCH, 20),
              date(2021, MARCH, 21),
              date(2021, MARCH, 22),
              date(2021, MARCH, 23),
              date(2021, MARCH, 24),
              date(2021, MARCH, 25),
              date(2021, MARCH, 26),
              date(2021, MARCH, 27),
              date(2021, MARCH, 28),
              date(2021, MARCH, 29),
              date(2021, MARCH, 30),
              date(2021, MARCH, 31),
          },
          completed_from=None)


def test_until_schedule():
    check(schedule=UntilSchedule(date(2021, JANUARY, 7)),
          start_date=date(2021, JANUARY, 1),
          number_of_days=90,
          scheduled_days={
              date(2021, JANUARY, 1),
              date(2021, JANUARY, 2),
              date(2021, JANUARY, 3),
              date(2021, JANUARY, 4),
              date(2021, JANUARY, 5),
              date(2021, JANUARY, 6),
          },
          completed_from=date(2021, JANUARY, 7))


def test_range_schedule():
    check(schedule=RangeSchedule(from_date=date(2021, JANUARY, 7),
                                 until_date=date(2021, JANUARY, 14)),
          start_date=date(2021, JANUARY, 1),
          number_of_days=90,
          scheduled_days={
              date(2021, JANUARY, 7),
              date(2021, JANUARY, 8),
              date(2021, JANUARY, 9),
              date(2021, JANUARY, 10),
              date(2021, JANUARY, 11),
              date(2021, JANUARY, 12),
              date(2021, JANUARY, 13),
          },
          completed_from=date(2021, JANUARY, 14))


def test_function_schedule():
    check(schedule=FunctionSchedule(
        function=lambda current_date: current_date.weekday() < SATURDAY if current_date < date(2021, JANUARY,
                                                                                               16) else None),
        start_date=date(2021, JANUARY, 1),
        number_of_days=30,
        scheduled_days={
            date(2021, JANUARY, 1),
            date(2021, JANUARY, 4),
            date(2021, JANUARY, 5),
            date(2021, JANUARY, 6),
            date(2021, JANUARY, 7),
            date(2021, JANUARY, 8),
            date(2021, JANUARY, 11),
            date(2021, JANUARY, 12),
            date(2021, JANUARY, 13),
            date(2021, JANUARY, 14),
            date(2021, JANUARY, 15),
        },
        completed_from=date(2021, JANUARY, 16))


def test_any_schedule():
    check(schedule=AnySchedule((DaySchedule(date(2021, JANUARY, 17)),
                                DaySchedule(date(2021, FEBRUARY, 10)),
                                DaySchedule(date(2021, MARCH, 24)))),
          start_date=date(2021, JANUARY, 1),
          number_of_days=90,
          scheduled_days={
              date(2021, JANUARY, 17),
              date(2021, FEBRUARY, 10),
              date(2021, MARCH, 24),
          },
          completed_from=date(2021, MARCH, 25))


def test_all_schedule():
    check(schedule=AllSchedule((UntilSchedule(date(2021, JANUARY, 17)),
                                FromSchedule(date(2021, JANUARY, 10)))),
          start_date=date(2021, JANUARY, 1),
          number_of_days=90,
          scheduled_days={
              date(2021, JANUARY, 10),
              date(2021, JANUARY, 11),
              date(2021, JANUARY, 12),
              date(2021, JANUARY, 13),
              date(2021, JANUARY, 14),
              date(2021, JANUARY, 15),
              date(2021, JANUARY, 16),
          },
          completed_from=date(2021, JANUARY, 17))
