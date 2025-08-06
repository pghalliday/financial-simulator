from calendar import TUESDAY
from datetime import date, timedelta

from financial_simulator.util.schedules import NeverSchedule, DailySchedule, DaySchedule, WeeklySchedule, \
    MonthlySchedule

DAY_0 = date(2021, 1, 1)
DAY_1 = DAY_0 + timedelta(days=1)
DAY_2 = DAY_1 + timedelta(days=1)
DAY_3 = DAY_2 + timedelta(days=1)
DAY_4 = DAY_3 + timedelta(days=1)
DAY_5 = DAY_4 + timedelta(days=1)
DAY_6 = DAY_5 + timedelta(days=1)
DAY_7 = DAY_6 + timedelta(days=1)


def test_never_schedule():
    schedule = NeverSchedule()
    assert schedule.check(DAY_0) is None
    assert schedule.check(DAY_1) is None
    assert schedule.check(DAY_2) is None
    assert schedule.check(DAY_3) is None
    assert schedule.check(DAY_4) is None


def test_daily_schedule():
    schedule = DailySchedule()
    assert schedule.check(DAY_0) == (schedule, True)
    assert schedule.check(DAY_1) == (schedule, True)
    assert schedule.check(DAY_2) == (schedule, True)
    assert schedule.check(DAY_3) == (schedule, True)
    assert schedule.check(DAY_4) == (schedule, True)


def test_weekly_schedule():
    schedule = WeeklySchedule(TUESDAY)
    assert schedule.check(DAY_0) == (schedule, False), f'DAY_0: {DAY_0.weekday()}'
    assert schedule.check(DAY_1) == (schedule, False), f'DAY_1: {DAY_1.weekday()}'
    assert schedule.check(DAY_2) == (schedule, False), f'DAY_2: {DAY_2.weekday()}'
    assert schedule.check(DAY_3) == (schedule, False), f'DAY_3: {DAY_3.weekday()}'
    assert schedule.check(DAY_4) == (schedule, True), f'DAY_4: {DAY_4.weekday()}'
    assert schedule.check(DAY_5) == (schedule, False), f'DAY_5: {DAY_5.weekday()}'
    assert schedule.check(DAY_6) == (schedule, False), f'DAY_6: {DAY_6.weekday()}'
    assert schedule.check(DAY_7) == (schedule, False), f'DAY_7: {DAY_7.weekday()}'


def test_day_schedule():
    schedule = DaySchedule(DAY_3)
    assert schedule.check(DAY_0) == (schedule, False)
    assert schedule.check(DAY_1) == (schedule, False)
    assert schedule.check(DAY_2) == (schedule, False)
    assert schedule.check(DAY_3) == (schedule, True)
    assert schedule.check(DAY_4) is None


def test_monthly_schedule():
    # TODO: test day greater than days in month
    schedule = MonthlySchedule(3)
    assert schedule.check(DAY_0) == (schedule, False), f'DAY_0: {DAY_0.day}'
    assert schedule.check(DAY_1) == (schedule, False), f'DAY_1: {DAY_1.day}'
    assert schedule.check(DAY_2) == (schedule, True), f'DAY_2: {DAY_2.day}'
    assert schedule.check(DAY_3) == (schedule, False), f'DAY_3: {DAY_3.day}'
    assert schedule.check(DAY_4) == (schedule, False), f'DAY_4: {DAY_4.day}'
    assert schedule.check(DAY_5) == (schedule, False), f'DAY_5: {DAY_5.day}'
    assert schedule.check(DAY_6) == (schedule, False), f'DAY_6: {DAY_6.day}'
    assert schedule.check(DAY_7) == (schedule, False), f'DAY_7: {DAY_7.day}'
