from datetime import date

from lib.utils.date import days_in_year


def annual_to_daily_interest_rate(annual_rate: float, current_date: date) -> float:
    return pow(1 + annual_rate, 1 / days_in_year(current_date.year)) - 1
