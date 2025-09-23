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

# %% [markdown]
# # Providers
#
# A collection of Provider implementations that will take the current date and provide values
# valid for that date. If the provider has not completed, it will return a new provider for use
# in the next call and a sequence of values. If the provider has completed then it will return
# `None`.

# %%
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
from financial_simulator.lib.util import \
    format_day

START_DATE = date.today()

print(f'Start Date: {format_day(START_DATE)}')

START_DATE = date.today()

print(f'Start Date: {format_day(START_DATE)}')

# %% [markdown]
# ## NeverProvider
#
# This is a trivial provider that always provides an empty sequence.

# %%
print_provided(initial_date=START_DATE,
               initial_provider=NeverProvider[str](),
               number_of_days=10)

# %% [markdown]
# ## AlwaysProvider
#
# This is a trivial provider that always provides a single value sequence.

# %%
print_provided(initial_date=START_DATE,
               initial_provider=AlwaysProvider('My value'),
               number_of_days=10)

# %% [markdown]
# ## ScheduledProvider
#
# This provider provides a single value sequence according to the specified schedule. If not scheduled it
# provides an empty sequence.

# %%
print_provided(initial_date=START_DATE,
               initial_provider=ScheduledProvider('My value',
                                                  AnySchedule((WeeklySchedule(TUESDAY),
                                                               WeeklySchedule(THURSDAY)))),
               number_of_days=10)

# %% [markdown]
# ## FunctionProvider
#
# This provider uses the specified function to map the current date to an instance of `Provided`.

# %%
print_provided(initial_date=START_DATE,
               initial_provider=FunctionProvider(lambda current_date: current_date.weekday()),
               number_of_days=10)

# %% [markdown]
# ## NextProvider
#
# This provider takes a sequence of providers and provides the values from the first provider that provides
# a non-empty sequence of values.

# %%
print_provided(initial_date=START_DATE,
               initial_provider=NextProvider(
                   (ScheduledProvider('Value 1', UntilSchedule(START_DATE + timedelta(days=3))),
                    ScheduledProvider('Value 2', UntilSchedule(START_DATE + timedelta(days=7))),
                    ScheduledProvider('Value 3', UntilSchedule(START_DATE + timedelta(days=9))))),
               number_of_days=10)

# %% [markdown]
# ## MergeProvider
#
# This provider takes a sequence of providers and provides a corresponding sequence of the merged values provided
# by those providers.

# %%
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

# %% [markdown]
# ## MapProvider
#
# This provider uses the specified transform function to transform the values provided by the specified provider

# %%
print_provided(initial_date=START_DATE,
               initial_provider=MapProvider(transform=lambda value: (value.upper(), value.lower()),
                                            provider=ScheduledProvider(value='My value',
                                                                       schedule=AnySchedule((WeeklySchedule(TUESDAY),
                                                                                             WeeklySchedule(
                                                                                                 THURSDAY))))),
               number_of_days=10)

# %% [markdown]
# ## FlatMapProvider
#
# This provider, like the `MapProvider`, uses the specified transform function to transform the values provided
# by the specified provider. However, in this case the transform function should return a sequence and these
# sequences will be flattened in the resulting `Provided` instance.

# %%
print_provided(initial_date=START_DATE,
               initial_provider=FlatMapProvider(transform=lambda value: (value.upper(), value.lower()),
                                                provider=ScheduledProvider(value='My value',
                                                                           schedule=AnySchedule(
                                                                               (WeeklySchedule(TUESDAY),
                                                                                WeeklySchedule(
                                                                                    THURSDAY))))),
               number_of_days=10)

# %% [markdown]
# ## MergeMapProvider
#
# This provider, like the `MapProvider`, uses the specified transform function to transform the values provided
# by the specified provider. However, in this case, the transform function should return a new `Provider` instance.
# The values from these providers will be merged in future resulting `Provided` instances.

# %%
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

# %% [markdown]
# ## Factories
#
# The following factory methods are available to construct combinations of providers to implement common patterns.

# %% [markdown]
# ### create_sequence_provider
#
# This factory takes a mapping of days to values and returns a `Provider` that will provide the given values on the specified days.

# %%
sequence_days = [START_DATE + timedelta(days=i) for i in range(9)]
print_provided(initial_date=START_DATE,
               initial_provider=create_sequence_provider({day: format_day(day)
                                                          for day in sequence_days}),
               number_of_days=10)
