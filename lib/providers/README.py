# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.17.2
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# %% [markdown] papermill={"duration": 0.008136, "end_time": "2025-08-05T20:43:40.191726", "exception": false, "start_time": "2025-08-05T20:43:40.183590", "status": "completed"}
# # Providers
#
# A collection of Provider implementations that will take the current date and provide sequences of values
# valid for that date. The sequence will be wrapped in an instance `Provided` that will also indicate if the
# provider has completed (i.e., it will not provide any more values).

# %% papermill={"duration": 0.034521, "end_time": "2025-08-05T20:43:40.231314", "exception": false, "start_time": "2025-08-05T20:43:40.196793", "status": "completed"}
from calendar import TUESDAY, THURSDAY
from datetime import date, timedelta

from lib.providers import \
    NeverProvider, \
    AlwaysProvider, \
    ScheduledProvider, \
    NextProvider, \
    MergeProvider, \
    FunctionProvider, \
    MapProvider, \
    FlatMapProvider, \
    MergeMapProvider, \
    Provided, \
    create_sequence_provider
from lib.schedules import \
    WeeklySchedule, \
    AnySchedule, \
    UntilSchedule
from lib.utils.format import \
    format_day, \
    format_values

START_DATE = date.today()

print(f'Start Date: {format_day(START_DATE)}')

# %% [markdown] papermill={"duration": 0.002675, "end_time": "2025-08-05T20:43:40.236915", "exception": false, "start_time": "2025-08-05T20:43:40.234240", "status": "completed"}
# ## NeverProvider
#
# This is a trivial provider that always provides an empty sequence.

# %% papermill={"duration": 0.006416, "end_time": "2025-08-05T20:43:40.245706", "exception": false, "start_time": "2025-08-05T20:43:40.239290", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(NeverProvider[str]().get, days))
print(format_values(values))

# %% [markdown] papermill={"duration": 0.002013, "end_time": "2025-08-05T20:43:40.249885", "exception": false, "start_time": "2025-08-05T20:43:40.247872", "status": "completed"}
# ## AlwaysProvider
#
# This is a trivial provider that always provides a single value sequence.

# %% papermill={"duration": 0.005169, "end_time": "2025-08-05T20:43:40.257030", "exception": false, "start_time": "2025-08-05T20:43:40.251861", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(AlwaysProvider('My value').get, days))
print(format_values(values))

# %% [markdown] papermill={"duration": 0.001883, "end_time": "2025-08-05T20:43:40.261717", "exception": false, "start_time": "2025-08-05T20:43:40.259834", "status": "completed"}
# ## ScheduledProvider
#
# This provider provides a single value sequence according to the specified schedule. If not scheduled it
# provides an empty sequence.

# %% papermill={"duration": 0.005194, "end_time": "2025-08-05T20:43:40.268669", "exception": false, "start_time": "2025-08-05T20:43:40.263475", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(ScheduledProvider('My value',
                                         AnySchedule((WeeklySchedule(TUESDAY),
                                                      WeeklySchedule(THURSDAY)))).get, days))
print(format_values(values))

# %% [markdown] papermill={"duration": 0.001666, "end_time": "2025-08-05T20:43:40.272104", "exception": false, "start_time": "2025-08-05T20:43:40.270438", "status": "completed"}
# ## FunctionProvider
#
# This provider uses the specified function to map the current date to an instance of `Provided`.

# %% papermill={"duration": 0.004689, "end_time": "2025-08-05T20:43:40.278429", "exception": false, "start_time": "2025-08-05T20:43:40.273740", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(FunctionProvider(lambda current_date: Provided(values=(current_date.weekday(),),
                                                                      complete=False)).get, days))
print(format_values(values))

# %% [markdown] papermill={"duration": 0.001546, "end_time": "2025-08-05T20:43:40.281599", "exception": false, "start_time": "2025-08-05T20:43:40.280053", "status": "completed"}
# ## NextProvider
#
# This provider takes a sequence of providers and provides the values from the first provider that provides
# a non-empty sequence of values.

# %% papermill={"duration": 0.004482, "end_time": "2025-08-05T20:43:40.287624", "exception": false, "start_time": "2025-08-05T20:43:40.283142", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(NextProvider(
    (ScheduledProvider('Value 1', UntilSchedule(START_DATE + timedelta(days=3))),
     ScheduledProvider('Value 2', UntilSchedule(START_DATE + timedelta(days=7))),
     ScheduledProvider('Value 3', UntilSchedule(START_DATE + timedelta(days=9))))).get,
                       days))
print(format_values(values))

# %% [markdown] papermill={"duration": 0.001601, "end_time": "2025-08-05T20:43:40.290941", "exception": false, "start_time": "2025-08-05T20:43:40.289340", "status": "completed"}
# ## MergeProvider
#
# This provider takes a sequence of providers and provides a corresponding sequence of the merged values provided
# by those providers.

# %% papermill={"duration": 0.00471, "end_time": "2025-08-05T20:43:40.297216", "exception": false, "start_time": "2025-08-05T20:43:40.292506", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(MergeProvider((AlwaysProvider('Always value'),
                                      ScheduledProvider('Sometimes value', AnySchedule((WeeklySchedule(TUESDAY),
                                                                                        WeeklySchedule(THURSDAY)))),
                                      NextProvider(
                                          (ScheduledProvider('Value 1', UntilSchedule(START_DATE + timedelta(days=3))),
                                           ScheduledProvider('Value 2', UntilSchedule(START_DATE + timedelta(days=7))),
                                           ScheduledProvider('Value 3',
                                                             UntilSchedule(START_DATE + timedelta(days=9))))))).get,
                       days))
print(format_values(values))

# %% [markdown] papermill={"duration": 0.001859, "end_time": "2025-08-05T20:43:40.300860", "exception": false, "start_time": "2025-08-05T20:43:40.299001", "status": "completed"}
# ## MapProvider
#
# This provider uses the specified transform function to transform the values provided by the specified provider

# %% papermill={"duration": 0.005096, "end_time": "2025-08-05T20:43:40.307576", "exception": false, "start_time": "2025-08-05T20:43:40.302480", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(MapProvider(transform=lambda value: (value.upper(), value.lower()),
                                   provider=ScheduledProvider(value='My value',
                                                              schedule=AnySchedule((WeeklySchedule(TUESDAY),
                                                                                    WeeklySchedule(
                                                                                        THURSDAY))))).get, days))
print(format_values(values))

# %% [markdown] papermill={"duration": 0.001543, "end_time": "2025-08-05T20:43:40.310825", "exception": false, "start_time": "2025-08-05T20:43:40.309282", "status": "completed"}
# ## FlatMapProvider
#
# This provider, like the `MapProvider`, uses the specified transform function to transform the values provided
# by the specified provider. However, in this case the transform function should return a sequence and these
# sequences will be flattened in the resulting `Provided` instance.

# %% papermill={"duration": 0.004595, "end_time": "2025-08-05T20:43:40.316988", "exception": false, "start_time": "2025-08-05T20:43:40.312393", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(FlatMapProvider(transform=lambda value: (value.upper(), value.lower()),
                                       provider=ScheduledProvider(value='My value',
                                                                  schedule=AnySchedule((WeeklySchedule(TUESDAY),
                                                                                        WeeklySchedule(
                                                                                            THURSDAY))))).get, days))
print(format_values(values))

# %% [markdown] papermill={"duration": 0.001552, "end_time": "2025-08-05T20:43:40.320260", "exception": false, "start_time": "2025-08-05T20:43:40.318708", "status": "completed"}
# ## MergeMapProvider
#
# This provider, like the `MapProvider`, uses the specified transform function to transform the values provided
# by the specified provider. However, in this case, the transform function should return a new `Provider` instance.
# The values from these providers will be merged in future resulting `Provided` instances.

# %% papermill={"duration": 0.005562, "end_time": "2025-08-05T20:43:40.327356", "exception": false, "start_time": "2025-08-05T20:43:40.321794", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(15)]
sequence_days = [START_DATE + timedelta(days=i) for i in range(10)]
values = zip(days, map(MergeMapProvider(
    transform=lambda current_date, value: create_sequence_provider({current_date + timedelta(days=1): f'{value}-1',
                                                                    current_date + timedelta(days=2): f'{value}-2',
                                                                    current_date + timedelta(days=3): f'{value}-3',
                                                                    current_date + timedelta(days=4): f'{value}-4'}),
    provider=create_sequence_provider({day: day.weekday() for day in sequence_days})).get, days))
print(format_values(values))

# %% [markdown] papermill={"duration": 0.001599, "end_time": "2025-08-05T20:43:40.330711", "exception": false, "start_time": "2025-08-05T20:43:40.329112", "status": "completed"}
# ## Factories
#
# The following factory methods are available to construct combinations of providers to implement common patterns.

# %% [markdown] papermill={"duration": 0.001613, "end_time": "2025-08-05T20:43:40.333908", "exception": false, "start_time": "2025-08-05T20:43:40.332295", "status": "completed"}
# ### create_sequence_provider
#
# This factory takes a mapping of days to values and returns a `Provider` that will provide the given values on the specified days.

# %% papermill={"duration": 0.004643, "end_time": "2025-08-05T20:43:40.340168", "exception": false, "start_time": "2025-08-05T20:43:40.335525", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(10)]
sequence_days = [START_DATE + timedelta(days=i) for i in range(9)]
values = zip(days, map(create_sequence_provider({day: format_day(day)
                                                 for day in sequence_days}).get, days))
print(format_values(values))
