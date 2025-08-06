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
# # Schedules
#
# A collection of schedule implementations that will take the current date and check if that day
# is in the schedule. If the schedule is not complete, it will return a tuple of a new schedule to
# use (in case of a state change) and a boolean indicating whether the date is in the schedule.
# If the schedule is complete then it will return `None`

# %%
from calendar import TUESDAY, SATURDAY, JANUARY, FEBRUARY, APRIL, JULY, OCTOBER
from datetime import date, timedelta

from doc.src.financial_simulator.util.schedules import print_scheduled
from financial_simulator.util.format import \
    format_day
from financial_simulator.util.schedules import \
    NeverSchedule, \
    DailySchedule, \
    DaySchedule, \
    FromSchedule, \
    UntilSchedule, \
    RangeSchedule, \
    WeeklySchedule, \
    MonthlySchedule, \
    YearlySchedule, \
    FunctionSchedule, \
    AnySchedule, \
    AllSchedule

START_DATE = date.today()

print(f'Start Date: {format_day(START_DATE)}')

# %% [markdown]
# ## Primitive schedules
#
# The following schedules are the basic building blocks of schedules.

# %% [markdown]
# ### NeverSchedule
#
# This is a trivial schedule in that it always returns False

# %%
print_scheduled(initial_date=START_DATE,
                initial_schedule=NeverSchedule(),
                number_of_days=1000)

# %% [markdown]
# ### DailySchedule
#
# This is a trivial schedule in that it always returns True

# %%
print_scheduled(initial_date=START_DATE,
                initial_schedule=DailySchedule(),
                number_of_days=10)

# %% [markdown]
# ### DaySchedule
#
# This schedule will only match on the specified day

# %%
print_scheduled(initial_date=START_DATE,
                initial_schedule=DaySchedule(START_DATE + timedelta(days=50)),
                number_of_days=1000)

# %% [markdown]
# ### FromSchedule
#
# This schedule will match on all dates after and including the specified day

# %%
print_scheduled(initial_date=START_DATE,
                initial_schedule=FromSchedule(START_DATE + timedelta(days=10)),
                number_of_days=20)

# %% [markdown]
# ### UntilSchedule
#
# This schedule will match on all dates up to but not including the specified day

# %%
print_scheduled(initial_date=START_DATE,
                initial_schedule=UntilSchedule(START_DATE + timedelta(days=10)),
                number_of_days=20)

# %% [markdown]
# ### RangeSchedule
#
# This schedule will match on all dates after and including the `from_date` up to but not including
# the `until_date`

# %%
print_scheduled(initial_date=START_DATE,
                initial_schedule=RangeSchedule(from_date=START_DATE + timedelta(days=10),
                                               until_date=START_DATE + timedelta(days=20)),
                number_of_days=30)

# %% [markdown]
# ### WeeklySchedule
#
# This schedule will match on the specified day of the week

# %%
print_scheduled(initial_date=START_DATE,
                initial_schedule=WeeklySchedule(TUESDAY),
                number_of_days=50)

# %% [markdown]
# ### MonthlySchedule
#
# This schedule will match on the specified day of the month.
#
# > **_NB._** If the current month does not have the specified day (e.g., there is no 30th of February in any year)
# then the last day of the month will match.

# %%
print_scheduled(initial_date=START_DATE,
                initial_schedule=MonthlySchedule(30),
                number_of_days=500)

# %% [markdown]
# ### YearlySchedule
#
# This schedule will match on the specified day of specified month.
#
# > **_NB._** If the current month does not have the specified day (e.g., there is no 30th of February in any year)
# then the last day of the month will match.

# %%
print_scheduled(initial_date=START_DATE,
                initial_schedule=YearlySchedule(FEBRUARY, 30),
                number_of_days=5000)


# %% [markdown]
# ### FunctionSchedule
#
# This is a generic schedule that takes a callback function that will be used to check the supplied date.
# If the function returns None, then the schedule will be considered complete.

# %%
def func(current_date: date) -> bool | None:
    return current_date.weekday() < SATURDAY


print_scheduled(initial_date=START_DATE,
                initial_schedule=FunctionSchedule(func),
                number_of_days=20)

# %% [markdown]
# ## Schedule operators
#
# The following schedules take other schedules and apply an operator to them.

# %% [markdown]
# ### AnySchedule
#
# This represents a boolean `OR` operator for schedules. If any of the child schedules match the current date,
# then this schedule will match.
#
# For example, to get a quarterly schedule, you could create four Yearly schedules and Any them together.

# %%
print_scheduled(initial_date=START_DATE,
                initial_schedule=AnySchedule((YearlySchedule(JANUARY, 1),
                                              YearlySchedule(APRIL, 1),
                                              YearlySchedule(JULY, 1),
                                              YearlySchedule(OCTOBER, 1))),
                number_of_days=1000)

# %% [markdown]
# ### AllSchedule
#
# This represents a boolean `AND` operator for schedules. Only if all the child schedules match the current date,
# will this schedule match.
#
# For example, to get a weekly schedule but only until a certain date.

# %%
print_scheduled(initial_date=START_DATE,
                initial_schedule=AllSchedule((WeeklySchedule(TUESDAY),
                                              UntilSchedule(START_DATE + timedelta(days=30)))),
                number_of_days=50)
