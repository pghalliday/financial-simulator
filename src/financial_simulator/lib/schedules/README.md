# Schedules

A collection of schedule implementations that will take the current date and check if that day
is in the schedule. If the schedule is not complete, it will return a tuple of a new schedule to
use (in case of a state change) and a boolean indicating whether the date is in the schedule.
If the schedule is complete then it will return `None`

```python
from calendar import TUESDAY, SATURDAY, JANUARY, FEBRUARY, APRIL, JULY, OCTOBER
from datetime import date, timedelta

from doc.src.financial_simulator.lib.schedules import print_scheduled
from financial_simulator.lib.schedules import

NeverSchedule,
DailySchedule,
DaySchedule,
FromSchedule,
UntilSchedule,
RangeSchedule,
WeeklySchedule,
MonthlySchedule,
YearlySchedule,
FunctionSchedule,
AnySchedule,
AllSchedule
from financial_simulator.lib.util import

format_day

START_DATE = date.today()

print(f'Start Date: {format_day(START_DATE)}')
```

    Start Date: 2025-08-26 : Tue

## Primitive schedules

The following schedules are the basic building blocks of schedules.

### NeverSchedule

This is a trivial schedule in that it always returns False

```python
print_scheduled(initial_date=START_DATE,
                initial_schedule=NeverSchedule(),
                number_of_days=1000)
```

    []
    Completed at: 2025-08-26 : Tue

### DailySchedule

This is a trivial schedule in that it always returns True

```python
print_scheduled(initial_date=START_DATE,
                initial_schedule=DailySchedule(),
                number_of_days=10)
```

    [2025-08-26 : Tue
     2025-08-27 : Wed
     2025-08-28 : Thu
     2025-08-29 : Fri
     2025-08-30 : Sat
     2025-08-31 : Sun
     2025-09-01 : Mon
     2025-09-02 : Tue
     2025-09-03 : Wed
     2025-09-04 : Thu]
    Completed at: Not completed

### DaySchedule

This schedule will only match on the specified day

```python
print_scheduled(initial_date=START_DATE,
                initial_schedule=DaySchedule(START_DATE + timedelta(days=50)),
                number_of_days=1000)
```

    [2025-10-15 : Wed]
    Completed at: 2025-10-16 : Thu

### FromSchedule

This schedule will match on all dates after and including the specified day

```python
print_scheduled(initial_date=START_DATE,
                initial_schedule=FromSchedule(START_DATE + timedelta(days=10)),
                number_of_days=20)
```

    [2025-09-05 : Fri
     2025-09-06 : Sat
     2025-09-07 : Sun
     2025-09-08 : Mon
     2025-09-09 : Tue
     2025-09-10 : Wed
     2025-09-11 : Thu
     2025-09-12 : Fri
     2025-09-13 : Sat
     2025-09-14 : Sun]
    Completed at: Not completed

### UntilSchedule

This schedule will match on all dates up to but not including the specified day

```python
print_scheduled(initial_date=START_DATE,
                initial_schedule=UntilSchedule(START_DATE + timedelta(days=10)),
                number_of_days=20)
```

    [2025-08-26 : Tue
     2025-08-27 : Wed
     2025-08-28 : Thu
     2025-08-29 : Fri
     2025-08-30 : Sat
     2025-08-31 : Sun
     2025-09-01 : Mon
     2025-09-02 : Tue
     2025-09-03 : Wed
     2025-09-04 : Thu]
    Completed at: 2025-09-05 : Fri

### RangeSchedule

This schedule will match on all dates after and including the `from_date` up to but not including
the `until_date`

```python
print_scheduled(initial_date=START_DATE,
                initial_schedule=RangeSchedule(from_date=START_DATE + timedelta(days=10),
                                               until_date=START_DATE + timedelta(days=20)),
                number_of_days=30)
```

    [2025-09-05 : Fri
     2025-09-06 : Sat
     2025-09-07 : Sun
     2025-09-08 : Mon
     2025-09-09 : Tue
     2025-09-10 : Wed
     2025-09-11 : Thu
     2025-09-12 : Fri
     2025-09-13 : Sat
     2025-09-14 : Sun]
    Completed at: 2025-09-15 : Mon

### WeeklySchedule

This schedule will match on the specified day of the week

```python
print_scheduled(initial_date=START_DATE,
                initial_schedule=WeeklySchedule(TUESDAY),
                number_of_days=50)
```

    [2025-08-26 : Tue
     2025-09-02 : Tue
     2025-09-09 : Tue
     2025-09-16 : Tue
     2025-09-23 : Tue
     2025-09-30 : Tue
     2025-10-07 : Tue
     2025-10-14 : Tue]
    Completed at: Not completed

### MonthlySchedule

This schedule will match on the specified day of the month.

> **_NB._** If the current month does not have the specified day (e.g., there is no 30th of February in any year)
> then the last day of the month will match.

```python
print_scheduled(initial_date=START_DATE,
                initial_schedule=MonthlySchedule(30),
                number_of_days=500)
```

    [2025-08-30 : Sat
     2025-09-30 : Tue
     2025-10-30 : Thu
     2025-11-30 : Sun
     2025-12-30 : Tue
     2026-01-30 : Fri
     2026-02-28 : Sat
     2026-03-30 : Mon
     2026-04-30 : Thu
     2026-05-30 : Sat
     2026-06-30 : Tue
     2026-07-30 : Thu
     2026-08-30 : Sun
     2026-09-30 : Wed
     2026-10-30 : Fri
     2026-11-30 : Mon
     2026-12-30 : Wed]
    Completed at: Not completed

### YearlySchedule

This schedule will match on the specified day of specified month.

> **_NB._** If the current month does not have the specified day (e.g., there is no 30th of February in any year)
> then the last day of the month will match.

```python
print_scheduled(initial_date=START_DATE,
                initial_schedule=YearlySchedule(FEBRUARY, 30),
                number_of_days=5000)
```

    [2026-02-28 : Sat
     2027-02-28 : Sun
     2028-02-29 : Tue
     2029-02-28 : Wed
     2030-02-28 : Thu
     2031-02-28 : Fri
     2032-02-29 : Sun
     2033-02-28 : Mon
     2034-02-28 : Tue
     2035-02-28 : Wed
     2036-02-29 : Fri
     2037-02-28 : Sat
     2038-02-28 : Sun
     2039-02-28 : Mon]
    Completed at: Not completed

### FunctionSchedule

This is a generic schedule that takes a callback function that will be used to check the supplied date.
If the function returns None, then the schedule will be considered complete.

```python
def func(current_date: date) -> bool | None:
    return current_date.weekday() < SATURDAY


print_scheduled(initial_date=START_DATE,
                initial_schedule=FunctionSchedule(func),
                number_of_days=20)
```

    [2025-08-26 : Tue
     2025-08-27 : Wed
     2025-08-28 : Thu
     2025-08-29 : Fri
     2025-09-01 : Mon
     2025-09-02 : Tue
     2025-09-03 : Wed
     2025-09-04 : Thu
     2025-09-05 : Fri
     2025-09-08 : Mon
     2025-09-09 : Tue
     2025-09-10 : Wed
     2025-09-11 : Thu
     2025-09-12 : Fri]
    Completed at: Not completed

## Schedule operators

The following schedules take other schedules and apply an operator to them.

### AnySchedule

This represents a boolean `OR` operator for schedules. If any of the child schedules match the current date,
then this schedule will match.

For example, to get a quarterly schedule, you could create four Yearly schedules and Any them together.

```python
print_scheduled(initial_date=START_DATE,
                initial_schedule=AnySchedule((YearlySchedule(JANUARY, 1),
                                              YearlySchedule(APRIL, 1),
                                              YearlySchedule(JULY, 1),
                                              YearlySchedule(OCTOBER, 1))),
                number_of_days=1000)
```

    [2025-10-01 : Wed
     2026-01-01 : Thu
     2026-04-01 : Wed
     2026-07-01 : Wed
     2026-10-01 : Thu
     2027-01-01 : Fri
     2027-04-01 : Thu
     2027-07-01 : Thu
     2027-10-01 : Fri
     2028-01-01 : Sat
     2028-04-01 : Sat]
    Completed at: Not completed

### AllSchedule

This represents a boolean `AND` operator for schedules. Only if all the child schedules match the current date,
will this schedule match.

For example, to get a weekly schedule but only until a certain date.

```python
print_scheduled(initial_date=START_DATE,
                initial_schedule=AllSchedule((WeeklySchedule(TUESDAY),
                                              UntilSchedule(START_DATE + timedelta(days=30)))),
                number_of_days=50)
```

    [2025-08-26 : Tue
     2025-09-02 : Tue
     2025-09-09 : Tue
     2025-09-16 : Tue
     2025-09-23 : Tue]
    Completed at: 2025-09-25 : Thu

