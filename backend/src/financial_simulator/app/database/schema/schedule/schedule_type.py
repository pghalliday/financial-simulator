from enum import StrEnum


class ScheduleType(StrEnum):
    DAILY = "daily_schedule"
    DAY = "day_schedule"
    FROM = "from_schedule"
    MONTHLY = "monthly_schedule"
    RANGE = "range_schedule"
    UNTIL = "until_schedule"
    WEEKLY = "weekly_schedule"
    YEARLY = "yearly_schedule"
    ALL = "all_schedule"
    ANY = "any_schedule"
