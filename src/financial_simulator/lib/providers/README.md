# Providers

A collection of Provider implementations that will take the current date and provide values
valid for that date. If the provider has not completed, it will return a new provider for use
in the next call and a sequence of values. If the provider has completed then it will return
`None`.


```python
from calendar import TUESDAY, THURSDAY
from datetime import date, timedelta

from doc.src.financial_simulator.lib.providers import print_provided
from financial_simulator.lib.providers import \
    NeverProvider, \
    AlwaysProvider, \
    ScheduledProvider, \
    NextProvider, \
    MergeProvider, \
    FunctionProvider, \
    MapProvider, \
    FlatMapProvider, \
    MergeMapProvider, \
    create_sequence_provider
from financial_simulator.lib.schedules import \
    WeeklySchedule, \
    AnySchedule, \
    UntilSchedule
from financial_simulator.lib.util.format import \
    format_day

START_DATE = date.today()

print(f'Start Date: {format_day(START_DATE)}')

START_DATE = date.today()

print(f'Start Date: {format_day(START_DATE)}')
```

    Start Date: 2025-09-25 : Thu
    Start Date: 2025-09-25 : Thu


## NeverProvider

This is a trivial provider that always provides an empty sequence.


```python
print_provided(initial_date=START_DATE,
               initial_provider=NeverProvider[str](),
               number_of_days=10)
```

    [2025-09-25 : Thu : None
     2025-09-26 : Fri : None
     2025-09-27 : Sat : None
     2025-09-28 : Sun : None
     2025-09-29 : Mon : None
     2025-09-30 : Tue : None
     2025-10-01 : Wed : None
     2025-10-02 : Thu : None
     2025-10-03 : Fri : None
     2025-10-04 : Sat : None]
    Completed at: 2025-09-25 : Thu


## AlwaysProvider

This is a trivial provider that always provides a single value sequence.


```python
print_provided(initial_date=START_DATE,
               initial_provider=AlwaysProvider('My value'),
               number_of_days=10)
```

    [2025-09-25 : Thu : ('My value',)
     2025-09-26 : Fri : ('My value',)
     2025-09-27 : Sat : ('My value',)
     2025-09-28 : Sun : ('My value',)
     2025-09-29 : Mon : ('My value',)
     2025-09-30 : Tue : ('My value',)
     2025-10-01 : Wed : ('My value',)
     2025-10-02 : Thu : ('My value',)
     2025-10-03 : Fri : ('My value',)
     2025-10-04 : Sat : ('My value',)]
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

    [2025-09-25 : Thu : ('My value',)
     2025-09-26 : Fri : ()
     2025-09-27 : Sat : ()
     2025-09-28 : Sun : ()
     2025-09-29 : Mon : ()
     2025-09-30 : Tue : ('My value',)
     2025-10-01 : Wed : ()
     2025-10-02 : Thu : ('My value',)
     2025-10-03 : Fri : ()
     2025-10-04 : Sat : ()]
    Completed at: Not completed


## FunctionProvider

This provider uses the specified function to map the current date to an instance of `Provided`.


```python
print_provided(initial_date=START_DATE,
               initial_provider=FunctionProvider(lambda current_date: current_date.weekday()),
               number_of_days=10)
```

    [2025-09-25 : Thu : 3
     2025-09-26 : Fri : 4
     2025-09-27 : Sat : 5
     2025-09-28 : Sun : 6
     2025-09-29 : Mon : 0
     2025-09-30 : Tue : 1
     2025-10-01 : Wed : 2
     2025-10-02 : Thu : 3
     2025-10-03 : Fri : 4
     2025-10-04 : Sat : 5]
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

    [2025-09-25 : Thu : ('Value 1',)
     2025-09-26 : Fri : ('Value 1',)
     2025-09-27 : Sat : ('Value 1',)
     2025-09-28 : Sun : ('Value 2',)
     2025-09-29 : Mon : ('Value 2',)
     2025-09-30 : Tue : ('Value 2',)
     2025-10-01 : Wed : ('Value 2',)
     2025-10-02 : Thu : ('Value 3',)
     2025-10-03 : Fri : ('Value 3',)
     2025-10-04 : Sat : None]
    Completed at: 2025-10-04 : Sat


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

    [2025-09-25 : Thu : ('Always value', 'Sometimes value', 'Value 1')
     2025-09-26 : Fri : ('Always value', 'Value 1')
     2025-09-27 : Sat : ('Always value', 'Value 1')
     2025-09-28 : Sun : ('Always value', 'Value 2')
     2025-09-29 : Mon : ('Always value', 'Value 2')
     2025-09-30 : Tue : ('Always value', 'Sometimes value', 'Value 2')
     2025-10-01 : Wed : ('Always value', 'Value 2')
     2025-10-02 : Thu : ('Always value', 'Sometimes value', 'Value 3')
     2025-10-03 : Fri : ('Always value', 'Value 3')
     2025-10-04 : Sat : ('Always value',)]
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

    [2025-09-25 : Thu : (('MY VALUE', 'my value'),)
     2025-09-26 : Fri : ()
     2025-09-27 : Sat : ()
     2025-09-28 : Sun : ()
     2025-09-29 : Mon : ()
     2025-09-30 : Tue : (('MY VALUE', 'my value'),)
     2025-10-01 : Wed : ()
     2025-10-02 : Thu : (('MY VALUE', 'my value'),)
     2025-10-03 : Fri : ()
     2025-10-04 : Sat : ()]
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

    [2025-09-25 : Thu : ('MY VALUE', 'my value')
     2025-09-26 : Fri : ()
     2025-09-27 : Sat : ()
     2025-09-28 : Sun : ()
     2025-09-29 : Mon : ()
     2025-09-30 : Tue : ('MY VALUE', 'my value')
     2025-10-01 : Wed : ()
     2025-10-02 : Thu : ('MY VALUE', 'my value')
     2025-10-03 : Fri : ()
     2025-10-04 : Sat : ()]
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

    [2025-09-25 : Thu : ()
     2025-09-26 : Fri : ('3-1',)
     2025-09-27 : Sat : ('3-2', '4-1')
     2025-09-28 : Sun : ('3-3', '4-2', '5-1')
     2025-09-29 : Mon : ('3-4', '4-3', '5-2', '6-1')
     2025-09-30 : Tue : ('4-4', '5-3', '6-2', '0-1')
     2025-10-01 : Wed : ('5-4', '6-3', '0-2', '1-1')
     2025-10-02 : Thu : ('6-4', '0-3', '1-2', '2-1')
     2025-10-03 : Fri : ('0-4', '1-3', '2-2', '3-1')
     2025-10-04 : Sat : ('1-4', '2-3', '3-2', '4-1')
     2025-10-05 : Sun : ('2-4', '3-3', '4-2', '5-1')
     2025-10-06 : Mon : ('3-4', '4-3', '5-2')
     2025-10-07 : Tue : ('4-4', '5-3')
     2025-10-08 : Wed : ('5-4',)
     2025-10-09 : Thu : None]
    Completed at: 2025-10-09 : Thu


## Factories

The following factory methods are available to construct combinations of providers to implement common patterns.

### create_sequence_provider

This factory takes a mapping of days to values and returns a `Provider` that will provide the given values on the specified days.


```python
sequence_days = [START_DATE + timedelta(days=i) for i in range(9)]
print_provided(initial_date=START_DATE,
               initial_provider=create_sequence_provider({day: format_day(day)
                                                          for day in sequence_days}),
               number_of_days=10)
```

    [2025-09-25 : Thu : ('2025-09-25 : Thu',)
     2025-09-26 : Fri : ('2025-09-26 : Fri',)
     2025-09-27 : Sat : ('2025-09-27 : Sat',)
     2025-09-28 : Sun : ('2025-09-28 : Sun',)
     2025-09-29 : Mon : ('2025-09-29 : Mon',)
     2025-09-30 : Tue : ('2025-09-30 : Tue',)
     2025-10-01 : Wed : ('2025-10-01 : Wed',)
     2025-10-02 : Thu : ('2025-10-02 : Thu',)
     2025-10-03 : Fri : ('2025-10-03 : Fri',)
     2025-10-04 : Sat : None]
    Completed at: 2025-10-04 : Sat

