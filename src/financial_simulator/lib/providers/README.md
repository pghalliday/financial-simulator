# Providers

A collection of Provider implementations that will take the current date and provide values
valid for that date. If the provider has not completed, it will return a new provider for use
in the next call and a sequence of values. If the provider has completed then it will return
`None`.

```python
from calendar import TUESDAY, THURSDAY
from datetime import date, timedelta

from doc.src.financial_simulator.lib.providers import print_provided
from financial_simulator.lib.providers import

NeverProvider,
AlwaysProvider,
ScheduledProvider,
NextProvider,
MergeProvider,
FunctionProvider,
MapProvider,
FlatMapProvider,
MergeMapProvider,
create_sequence_provider
from financial_simulator.lib.schedules import

WeeklySchedule,
AnySchedule,
UntilSchedule
from financial_simulator.lib.util import

format_day

START_DATE = date.today()

print(f'Start Date: {format_day(START_DATE)}')

START_DATE = date.today()

print(f'Start Date: {format_day(START_DATE)}')
```

    Start Date: 2025-08-26 : Tue
    Start Date: 2025-08-26 : Tue

## NeverProvider

This is a trivial provider that always provides an empty sequence.

```python
print_provided(initial_date=START_DATE,
               initial_provider=NeverProvider[str](),
               number_of_days=10)
```

    [2025-08-26 : Tue : None
     2025-08-27 : Wed : None
     2025-08-28 : Thu : None
     2025-08-29 : Fri : None
     2025-08-30 : Sat : None
     2025-08-31 : Sun : None
     2025-09-01 : Mon : None
     2025-09-02 : Tue : None
     2025-09-03 : Wed : None
     2025-09-04 : Thu : None]
    Completed at: 2025-08-26 : Tue

## AlwaysProvider

This is a trivial provider that always provides a single value sequence.

```python
print_provided(initial_date=START_DATE,
               initial_provider=AlwaysProvider('My value'),
               number_of_days=10)
```

    [2025-08-26 : Tue : ('My value',)
     2025-08-27 : Wed : ('My value',)
     2025-08-28 : Thu : ('My value',)
     2025-08-29 : Fri : ('My value',)
     2025-08-30 : Sat : ('My value',)
     2025-08-31 : Sun : ('My value',)
     2025-09-01 : Mon : ('My value',)
     2025-09-02 : Tue : ('My value',)
     2025-09-03 : Wed : ('My value',)
     2025-09-04 : Thu : ('My value',)]
    Completed at: Not completed

## ScheduledProvider

This provider provides a single value sequence according to the specified schedule. If not scheduled it
provides an empty sequence.

```python
print_provided(initial_date=START_DATE,
               initial_provider=ScheduledProvider('My value',
                                                  AnySchedule((WeeklySchedule(TUESDAY),
                                                               WeeklySchedule(THURSDAY)))),
               number_of_days=10)
```

    [2025-08-26 : Tue : ('My value',)
     2025-08-27 : Wed : ()
     2025-08-28 : Thu : ('My value',)
     2025-08-29 : Fri : ()
     2025-08-30 : Sat : ()
     2025-08-31 : Sun : ()
     2025-09-01 : Mon : ()
     2025-09-02 : Tue : ('My value',)
     2025-09-03 : Wed : ()
     2025-09-04 : Thu : ('My value',)]
    Completed at: Not completed

## FunctionProvider

This provider uses the specified function to map the current date to an instance of `Provided`.

```python
print_provided(initial_date=START_DATE,
               initial_provider=FunctionProvider(lambda current_date: current_date.weekday()),
               number_of_days=10)
```

    [2025-08-26 : Tue : 1
     2025-08-27 : Wed : 2
     2025-08-28 : Thu : 3
     2025-08-29 : Fri : 4
     2025-08-30 : Sat : 5
     2025-08-31 : Sun : 6
     2025-09-01 : Mon : 0
     2025-09-02 : Tue : 1
     2025-09-03 : Wed : 2
     2025-09-04 : Thu : 3]
    Completed at: Not completed

## NextProvider

This provider takes a sequence of providers and provides the values from the first provider that provides
a non-empty sequence of values.

```python
print_provided(initial_date=START_DATE,
               initial_provider=NextProvider(
                   (ScheduledProvider('Value 1', UntilSchedule(START_DATE + timedelta(days=3))),
                    ScheduledProvider('Value 2', UntilSchedule(START_DATE + timedelta(days=7))),
                    ScheduledProvider('Value 3', UntilSchedule(START_DATE + timedelta(days=9))))),
               number_of_days=10)
```

    [2025-08-26 : Tue : ('Value 1',)
     2025-08-27 : Wed : ('Value 1',)
     2025-08-28 : Thu : ('Value 1',)
     2025-08-29 : Fri : ('Value 2',)
     2025-08-30 : Sat : ('Value 2',)
     2025-08-31 : Sun : ('Value 2',)
     2025-09-01 : Mon : ('Value 2',)
     2025-09-02 : Tue : ('Value 3',)
     2025-09-03 : Wed : ('Value 3',)
     2025-09-04 : Thu : None]
    Completed at: 2025-09-04 : Thu

## MergeProvider

This provider takes a sequence of providers and provides a corresponding sequence of the merged values provided
by those providers.

```python
print_provided(initial_date=START_DATE,
               initial_provider=MergeProvider((AlwaysProvider('Always value'),
                                               ScheduledProvider('Sometimes value',
                                                                 AnySchedule((WeeklySchedule(TUESDAY),
                                                                              WeeklySchedule(THURSDAY)))),
                                               NextProvider(
                                                   (ScheduledProvider('Value 1',
                                                                      UntilSchedule(START_DATE + timedelta(days=3))),
                                                    ScheduledProvider('Value 2',
                                                                      UntilSchedule(START_DATE + timedelta(days=7))),
                                                    ScheduledProvider('Value 3',
                                                                      UntilSchedule(
                                                                          START_DATE + timedelta(days=9))))))),
               number_of_days=10)
```

    [2025-08-26 : Tue : ('Always value', 'Sometimes value', 'Value 1')
     2025-08-27 : Wed : ('Always value', 'Value 1')
     2025-08-28 : Thu : ('Always value', 'Sometimes value', 'Value 1')
     2025-08-29 : Fri : ('Always value', 'Value 2')
     2025-08-30 : Sat : ('Always value', 'Value 2')
     2025-08-31 : Sun : ('Always value', 'Value 2')
     2025-09-01 : Mon : ('Always value', 'Value 2')
     2025-09-02 : Tue : ('Always value', 'Sometimes value', 'Value 3')
     2025-09-03 : Wed : ('Always value', 'Value 3')
     2025-09-04 : Thu : ('Always value', 'Sometimes value')]
    Completed at: Not completed

## MapProvider

This provider uses the specified transform function to transform the values provided by the specified provider

```python
print_provided(initial_date=START_DATE,
               initial_provider=MapProvider(transform=lambda value: (value.upper(), value.lower()),
                                            provider=ScheduledProvider(value='My value',
                                                                       schedule=AnySchedule((WeeklySchedule(TUESDAY),
                                                                                             WeeklySchedule(
                                                                                                 THURSDAY))))),
               number_of_days=10)
```

    [2025-08-26 : Tue : (('MY VALUE', 'my value'),)
     2025-08-27 : Wed : ()
     2025-08-28 : Thu : (('MY VALUE', 'my value'),)
     2025-08-29 : Fri : ()
     2025-08-30 : Sat : ()
     2025-08-31 : Sun : ()
     2025-09-01 : Mon : ()
     2025-09-02 : Tue : (('MY VALUE', 'my value'),)
     2025-09-03 : Wed : ()
     2025-09-04 : Thu : (('MY VALUE', 'my value'),)]
    Completed at: Not completed

## FlatMapProvider

This provider, like the `MapProvider`, uses the specified transform function to transform the values provided
by the specified provider. However, in this case the transform function should return a sequence and these
sequences will be flattened in the resulting `Provided` instance.

```python
print_provided(initial_date=START_DATE,
               initial_provider=FlatMapProvider(transform=lambda value: (value.upper(), value.lower()),
                                                provider=ScheduledProvider(value='My value',
                                                                           schedule=AnySchedule(
                                                                               (WeeklySchedule(TUESDAY),
                                                                                WeeklySchedule(
                                                                                    THURSDAY))))),
               number_of_days=10)
```

    [2025-08-26 : Tue : ('MY VALUE', 'my value')
     2025-08-27 : Wed : ()
     2025-08-28 : Thu : ('MY VALUE', 'my value')
     2025-08-29 : Fri : ()
     2025-08-30 : Sat : ()
     2025-08-31 : Sun : ()
     2025-09-01 : Mon : ()
     2025-09-02 : Tue : ('MY VALUE', 'my value')
     2025-09-03 : Wed : ()
     2025-09-04 : Thu : ('MY VALUE', 'my value')]
    Completed at: Not completed

## MergeMapProvider

This provider, like the `MapProvider`, uses the specified transform function to transform the values provided
by the specified provider. However, in this case, the transform function should return a new `Provider` instance.
The values from these providers will be merged in future resulting `Provided` instances.

```python
sequence_days = [START_DATE + timedelta(days=i) for i in range(10)]
print_provided(initial_date=START_DATE,
               initial_provider=MergeMapProvider(transform=lambda current_date, value: create_sequence_provider(
                   {current_date + timedelta(days=1): f'{value}-1',
                    current_date + timedelta(days=2): f'{value}-2',
                    current_date + timedelta(days=3): f'{value}-3',
                    current_date + timedelta(days=4): f'{value}-4'}),
                                                 provider=create_sequence_provider(
                                                     {day: day.weekday() for day in sequence_days})),
               number_of_days=15)
```

    [2025-08-26 : Tue : ()
     2025-08-27 : Wed : ('1-1',)
     2025-08-28 : Thu : ('1-2', '2-1')
     2025-08-29 : Fri : ('1-3', '2-2', '3-1')
     2025-08-30 : Sat : ('1-4', '2-3', '3-2', '4-1')
     2025-08-31 : Sun : ('2-4', '3-3', '4-2', '5-1')
     2025-09-01 : Mon : ('3-4', '4-3', '5-2', '6-1')
     2025-09-02 : Tue : ('4-4', '5-3', '6-2', '0-1')
     2025-09-03 : Wed : ('5-4', '6-3', '0-2', '1-1')
     2025-09-04 : Thu : ('6-4', '0-3', '1-2', '2-1')
     2025-09-05 : Fri : ('0-4', '1-3', '2-2', '3-1')
     2025-09-06 : Sat : ('1-4', '2-3', '3-2')
     2025-09-07 : Sun : ('2-4', '3-3')
     2025-09-08 : Mon : ('3-4',)
     2025-09-09 : Tue : None]
    Completed at: 2025-09-09 : Tue

## Factories

The following factory methods are available to construct combinations of providers to implement common patterns.

### create_sequence_provider

This factory takes a mapping of days to values and returns a `Provider` that will provide the given values on the
specified days.

```python
sequence_days = [START_DATE + timedelta(days=i) for i in range(9)]
print_provided(initial_date=START_DATE,
               initial_provider=create_sequence_provider({day: format_day(day)
                                                          for day in sequence_days}),
               number_of_days=10)
```

    [2025-08-26 : Tue : ('2025-08-26 : Tue',)
     2025-08-27 : Wed : ('2025-08-27 : Wed',)
     2025-08-28 : Thu : ('2025-08-28 : Thu',)
     2025-08-29 : Fri : ('2025-08-29 : Fri',)
     2025-08-30 : Sat : ('2025-08-30 : Sat',)
     2025-08-31 : Sun : ('2025-08-31 : Sun',)
     2025-09-01 : Mon : ('2025-09-01 : Mon',)
     2025-09-02 : Tue : ('2025-09-02 : Tue',)
     2025-09-03 : Wed : ('2025-09-03 : Wed',)
     2025-09-04 : Thu : None]
    Completed at: 2025-09-04 : Thu

