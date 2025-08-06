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

# %% [markdown] papermill={"duration": 0.015527, "end_time": "2025-08-05T20:43:44.404859", "exception": false, "start_time": "2025-08-05T20:43:44.389332", "status": "completed"}
# # Schedules
#
# A collection of schedule implementations that will take the current date and check if that day
# is in the schedule. The returned `Scheduled` instance will also indicate if the schedule is complete.

# %% papermill={"duration": 0.026027, "end_time": "2025-08-05T20:43:44.436609", "exception": false, "start_time": "2025-08-05T20:43:44.410582", "status": "completed"}
from calendar import TUESDAY, SATURDAY, JANUARY, FEBRUARY, APRIL, JULY, OCTOBER
from datetime import date, timedelta

from lib.schedules import \
    NeverSchedule, \
    DailySchedule, \
    DaySchedule, \
    FromSchedule, \
    UntilSchedule, \
    RangeSchedule, \
    WeeklySchedule, \
    MonthlySchedule, \
    YearlySchedule, \
    FilterSchedule, \
    AnySchedule, \
    AllSchedule, \
    Scheduled
from lib.utils.format import \
    format_day, \
    format_days

START_DATE = date.today()

print(f'Start Date: {format_day(START_DATE)}')

# %% [markdown] papermill={"duration": 0.003028, "end_time": "2025-08-05T20:43:44.443112", "exception": false, "start_time": "2025-08-05T20:43:44.440084", "status": "completed"}
# ## Primitive schedules
#
# The following schedules are the basic building blocks of schedules.

# %% [markdown] papermill={"duration": 0.002691, "end_time": "2025-08-05T20:43:44.448925", "exception": false, "start_time": "2025-08-05T20:43:44.446234", "status": "completed"}
# ### NeverSchedule
#
# This is a trivial schedule in that it always returns False

# %% papermill={"duration": 0.008143, "end_time": "2025-08-05T20:43:44.459708", "exception": false, "start_time": "2025-08-05T20:43:44.451565", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(1000)]
days_and_scheduled = [(day, NeverSchedule().check(day)) for day in days]
matches = [day for day, scheduled in days_and_scheduled if scheduled.match]
completed = next((format_day(day) for day, scheduled in days_and_scheduled if scheduled.complete), 'Not completed')
print(format_days(matches))
print(f'Completed: {completed}')

# %% [markdown] papermill={"duration": 0.002279, "end_time": "2025-08-05T20:43:44.464538", "exception": false, "start_time": "2025-08-05T20:43:44.462259", "status": "completed"}
# ### DailySchedule
#
# This is a trivial schedule in that it always returns True

# %% papermill={"duration": 0.005774, "end_time": "2025-08-05T20:43:44.472497", "exception": false, "start_time": "2025-08-05T20:43:44.466723", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(10)]
days_and_scheduled = [(day, DailySchedule().check(day)) for day in days]
matches = [day for day, scheduled in days_and_scheduled if scheduled.match]
completed = next((format_day(day) for day, scheduled in days_and_scheduled if scheduled.complete), 'Not completed')
print(format_days(matches))
print(f'Completed: {completed}')

# %% [markdown] papermill={"duration": 0.002022, "end_time": "2025-08-05T20:43:44.476726", "exception": false, "start_time": "2025-08-05T20:43:44.474704", "status": "completed"}
# ### DaySchedule
#
# This schedule will only match on the specified day

# %% papermill={"duration": 0.006258, "end_time": "2025-08-05T20:43:44.485014", "exception": false, "start_time": "2025-08-05T20:43:44.478756", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(1000)]
days_and_scheduled = [(day, DaySchedule(START_DATE + timedelta(days=50)).check(day)) for day in days]
matches = [day for day, scheduled in days_and_scheduled if scheduled.match]
completed = next((format_day(day) for day, scheduled in days_and_scheduled if scheduled.complete), 'Not completed')
print(format_days(matches))
print(f'Completed: {completed}')

# %% [markdown] papermill={"duration": 0.001901, "end_time": "2025-08-05T20:43:44.488914", "exception": false, "start_time": "2025-08-05T20:43:44.487013", "status": "completed"}
# ### FromSchedule
#
# This schedule will match on all dates after and including the specified day

# %% papermill={"duration": 0.00493, "end_time": "2025-08-05T20:43:44.495860", "exception": false, "start_time": "2025-08-05T20:43:44.490930", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(20)]
days_and_scheduled = [(day, FromSchedule(START_DATE + timedelta(days=10)).check(day)) for day in days]
matches = [day for day, scheduled in days_and_scheduled if scheduled.match]
completed = next((format_day(day) for day, scheduled in days_and_scheduled if scheduled.complete), 'Not completed')
print(format_days(matches))
print(f'Completed: {completed}')

# %% [markdown] papermill={"duration": 0.001784, "end_time": "2025-08-05T20:43:44.499481", "exception": false, "start_time": "2025-08-05T20:43:44.497697", "status": "completed"}
# ### UntilSchedule
#
# This schedule will match on all dates up to but not including the specified day

# %% papermill={"duration": 0.004721, "end_time": "2025-08-05T20:43:44.506032", "exception": false, "start_time": "2025-08-05T20:43:44.501311", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(20)]
days_and_scheduled = [(day, UntilSchedule(START_DATE + timedelta(days=10)).check(day)) for day in days]
matches = [day for day, scheduled in days_and_scheduled if scheduled.match]
completed = next((format_day(day) for day, scheduled in days_and_scheduled if scheduled.complete), 'Not completed')
print(format_days(matches))
print(f'Completed: {completed}')

# %% [markdown] papermill={"duration": 0.001752, "end_time": "2025-08-05T20:43:44.509619", "exception": false, "start_time": "2025-08-05T20:43:44.507867", "status": "completed"}
# ### RangeSchedule
#
# This schedule will match on all dates after and including the `from_date` up to but not including
# the `until_date`

# %% papermill={"duration": 0.005069, "end_time": "2025-08-05T20:43:44.516615", "exception": false, "start_time": "2025-08-05T20:43:44.511546", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(30)]
days_and_scheduled = [(day, RangeSchedule(from_date=START_DATE + timedelta(days=10),
                                          until_date=START_DATE + timedelta(days=20)).check(day)) for day in days]
matches = [day for day, scheduled in days_and_scheduled if scheduled.match]
completed = next((format_day(day) for day, scheduled in days_and_scheduled if scheduled.complete), 'Not completed')
print(format_days(matches))
print(f'Completed: {completed}')

# %% [markdown] papermill={"duration": 0.001781, "end_time": "2025-08-05T20:43:44.520535", "exception": false, "start_time": "2025-08-05T20:43:44.518754", "status": "completed"}
# ### WeeklySchedule
#
# This schedule will match on the specified day of the week

# %% papermill={"duration": 0.005163, "end_time": "2025-08-05T20:43:44.527468", "exception": false, "start_time": "2025-08-05T20:43:44.522305", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(50)]
days_and_scheduled = [(day, WeeklySchedule(TUESDAY).check(day)) for day in days]
matches = [day for day, scheduled in days_and_scheduled if scheduled.match]
completed = next((format_day(day) for day, scheduled in days_and_scheduled if scheduled.complete), 'Not completed')
print(format_days(matches))
print(f'Completed: {completed}')

# %% [markdown] papermill={"duration": 0.001749, "end_time": "2025-08-05T20:43:44.531043", "exception": false, "start_time": "2025-08-05T20:43:44.529294", "status": "completed"}
# ### MonthlySchedule
#
# This schedule will match on the specified day of the month.
#
# > **_NB._** If the current month does not have the specified day (e.g., there is no 30th of February in any year)
# then the last day of the month will match.

# %% papermill={"duration": 0.005637, "end_time": "2025-08-05T20:43:44.538443", "exception": false, "start_time": "2025-08-05T20:43:44.532806", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(500)]
days_and_scheduled = [(day, MonthlySchedule(30).check(day)) for day in days]
matches = [day for day, scheduled in days_and_scheduled if scheduled.match]
completed = next((format_day(day) for day, scheduled in days_and_scheduled if scheduled.complete), 'Not completed')
print(format_days(matches))
print(f'Completed: {completed}')

# %% [markdown] papermill={"duration": 0.001799, "end_time": "2025-08-05T20:43:44.542152", "exception": false, "start_time": "2025-08-05T20:43:44.540353", "status": "completed"}
# ### YearlySchedule
#
# This schedule will match on the specified day of specified month.
#
# > **_NB._** If the current month does not have the specified day (e.g., there is no 30th of February in any year)
# then the last day of the month will match.

# %% papermill={"duration": 0.010553, "end_time": "2025-08-05T20:43:44.554622", "exception": false, "start_time": "2025-08-05T20:43:44.544069", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(5000)]
days_and_scheduled = [(day, YearlySchedule(FEBRUARY, 30).check(day)) for day in days]
matches = [day for day, scheduled in days_and_scheduled if scheduled.match]
completed = next((format_day(day) for day, scheduled in days_and_scheduled if scheduled.complete), 'Not completed')
print(format_days(matches))
print(f'Completed: {completed}')

# %% [markdown] papermill={"duration": 0.001792, "end_time": "2025-08-05T20:43:44.558311", "exception": false, "start_time": "2025-08-05T20:43:44.556519", "status": "completed"}
# ### FilterSchedule
#
# This is a generic schedule that takes a callback function that will be used to check the supplied date

# %% papermill={"duration": 0.005104, "end_time": "2025-08-05T20:43:44.565288", "exception": false, "start_time": "2025-08-05T20:43:44.560184", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(20)]


def filter_func(current_date: date) -> Scheduled:
    return Scheduled(match=current_date.weekday() < SATURDAY,
                     complete=False)


days_and_scheduled = [(day, FilterSchedule(filter_func).check(day)) for day in days]
matches = [day for day, scheduled in days_and_scheduled if scheduled.match]
completed = next((format_day(day) for day, scheduled in days_and_scheduled if scheduled.complete), 'Not completed')
print(format_days(matches))
print(f'Completed: {completed}')

# %% [markdown] papermill={"duration": 0.001922, "end_time": "2025-08-05T20:43:44.569173", "exception": false, "start_time": "2025-08-05T20:43:44.567251", "status": "completed"}
# ## Schedule operators
#
# The following schedules take other schedules and apply an operator to them.

# %% [markdown] papermill={"duration": 0.001808, "end_time": "2025-08-05T20:43:44.572844", "exception": false, "start_time": "2025-08-05T20:43:44.571036", "status": "completed"}
# ### AnySchedule
#
# This represents a boolean `OR` operator for schedules. If any of the child schedules match the current date,
# then this schedule will match.
#
# For example, to get a quarterly schedule, you could create four Yearly schedules and Any them together.

# %% papermill={"duration": 0.009689, "end_time": "2025-08-05T20:43:44.584312", "exception": false, "start_time": "2025-08-05T20:43:44.574623", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(1000)]
days_and_scheduled = [(day, AnySchedule((YearlySchedule(JANUARY, 1),
                                         YearlySchedule(APRIL, 1),
                                         YearlySchedule(JULY, 1),
                                         YearlySchedule(OCTOBER, 1))).check(day)) for day in days]
matches = [day for day, scheduled in days_and_scheduled if scheduled.match]
completed = next((format_day(day) for day, scheduled in days_and_scheduled if scheduled.complete), 'Not completed')
print(format_days(matches))
print(f'Completed: {completed}')

# %% [markdown] papermill={"duration": 0.001852, "end_time": "2025-08-05T20:43:44.588159", "exception": false, "start_time": "2025-08-05T20:43:44.586307", "status": "completed"}
# ### AllSchedule
#
# This represents a boolean `AND` operator for schedules. Only if all the child schedules match the current date,
# will this schedule match.
#
# For example, to get a weekly schedule but only until a certain date.

# %% papermill={"duration": 0.005037, "end_time": "2025-08-05T20:43:44.595025", "exception": false, "start_time": "2025-08-05T20:43:44.589988", "status": "completed"}
days = [START_DATE + timedelta(days=i) for i in range(50)]
days_and_scheduled = [(day, AllSchedule((WeeklySchedule(TUESDAY),
                                         UntilSchedule(START_DATE + timedelta(days=30)))).check(day)) for day in days]
matches = [day for day, scheduled in days_and_scheduled if scheduled.match]
completed = next((format_day(day) for day, scheduled in days_and_scheduled if scheduled.complete), 'Not completed')
print(format_days(matches))
print(f'Completed: {completed}')
