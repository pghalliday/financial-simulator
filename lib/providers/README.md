# Providers

A collection of Provider implementations that will take the current date and provide an
item valid for that date.

```python
from calendar import TUESDAY, THURSDAY
from datetime import date, timedelta

from lib.providers import
    NeverProvider,
    AlwaysProvider,
    ScheduledProvider,
    AnyProvider,
    AllProvider
from lib.schedules import
    WeeklySchedule,
    AnySchedule,
    UntilSchedule
from lib.utils.format import
    format_day,
    format_values

START_DATE = date.today()

print(f'Start Date: {format_day(START_DATE)}')
```

    Start Date: 2025-08-04 : Mon

## NeverProvider

This is a trivial provider that always provides `None`

```python
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(NeverProvider[str]().get, days))
print(format_values(values))
```

    [2025-08-04 : Mon : None
     2025-08-05 : Tue : None
     2025-08-06 : Wed : None
     2025-08-07 : Thu : None
     2025-08-08 : Fri : None
     2025-08-09 : Sat : None
     2025-08-10 : Sun : None
     2025-08-11 : Mon : None
     2025-08-12 : Tue : None
     2025-08-13 : Wed : None]

## AlwaysProvider

This is a trivial provider that always provides the given value

```python
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(AlwaysProvider('My value').get, days))
print(format_values(values))
```

    [2025-08-04 : Mon : My value
     2025-08-05 : Tue : My value
     2025-08-06 : Wed : My value
     2025-08-07 : Thu : My value
     2025-08-08 : Fri : My value
     2025-08-09 : Sat : My value
     2025-08-10 : Sun : My value
     2025-08-11 : Mon : My value
     2025-08-12 : Tue : My value
     2025-08-13 : Wed : My value]

## ScheduledProvider

This provider provides its value according to the specified schedule. If not scheduled it provides `None`.

```python
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(ScheduledProvider('My value',
                                         AnySchedule({'Tuesdays': WeeklySchedule(TUESDAY),
                                                      'Thursdays': WeeklySchedule(THURSDAY)})).get, days))
print(format_values(values))
```

    [2025-08-04 : Mon : None
     2025-08-05 : Tue : My value
     2025-08-06 : Wed : None
     2025-08-07 : Thu : My value
     2025-08-08 : Fri : None
     2025-08-09 : Sat : None
     2025-08-10 : Sun : None
     2025-08-11 : Mon : None
     2025-08-12 : Tue : My value
     2025-08-13 : Wed : None]

## AnyProvider

This provider takes a list of providers and provides the value from the first provider that provides a not `None` value.
If all
the providers provide `None` then `None` will be provided.

```python
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(AnyProvider([ScheduledProvider('Value 1', UntilSchedule(START_DATE + timedelta(days=3))),
                                    ScheduledProvider('Value 2', UntilSchedule(START_DATE + timedelta(days=7))),
                                    ScheduledProvider('Value 3', UntilSchedule(START_DATE + timedelta(days=9)))]).get,
                       days))
print(format_values(values))
```

    [2025-08-04 : Mon : Value 1
     2025-08-05 : Tue : Value 1
     2025-08-06 : Wed : Value 1
     2025-08-07 : Thu : Value 2
     2025-08-08 : Fri : Value 2
     2025-08-09 : Sat : Value 2
     2025-08-10 : Sun : Value 2
     2025-08-11 : Mon : Value 3
     2025-08-12 : Tue : Value 3
     2025-08-13 : Wed : None]

## AllProvider

This provider takes a dictionary of providers and provides a corresponding dictionary of the values provided by each
provider

```python
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(AllProvider({'Always': AlwaysProvider('My value'),
                                    'Scheduled': ScheduledProvider('My value',
                                                                   AnySchedule({'Tuesdays': WeeklySchedule(TUESDAY),
                                                                                'Thursdays': WeeklySchedule(
                                                                                    THURSDAY)})),
                                    'Any': AnyProvider(
                                        [ScheduledProvider('Value 1', UntilSchedule(START_DATE + timedelta(days=3))),
                                         ScheduledProvider('Value 2', UntilSchedule(START_DATE + timedelta(days=7))),
                                         ScheduledProvider('Value 3',
                                                           UntilSchedule(START_DATE + timedelta(days=9)))])}).get,
                       days))
print(format_values(values))
```

    [2025-08-04 : Mon : {'Always': 'My value', 'Scheduled': None, 'Any': 'Value 1'}
     2025-08-05 : Tue : {'Always': 'My value', 'Scheduled': 'My value', 'Any': 'Value 1'}
     2025-08-06 : Wed : {'Always': 'My value', 'Scheduled': None, 'Any': 'Value 1'}
     2025-08-07 : Thu : {'Always': 'My value', 'Scheduled': 'My value', 'Any': 'Value 2'}
     2025-08-08 : Fri : {'Always': 'My value', 'Scheduled': None, 'Any': 'Value 2'}
     2025-08-09 : Sat : {'Always': 'My value', 'Scheduled': None, 'Any': 'Value 2'}
     2025-08-10 : Sun : {'Always': 'My value', 'Scheduled': None, 'Any': 'Value 2'}
     2025-08-11 : Mon : {'Always': 'My value', 'Scheduled': None, 'Any': 'Value 3'}
     2025-08-12 : Tue : {'Always': 'My value', 'Scheduled': 'My value', 'Any': 'Value 3'}
     2025-08-13 : Wed : {'Always': 'My value', 'Scheduled': None, 'Any': None}]

