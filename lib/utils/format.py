from datetime import date
from typing import List, Tuple, Dict


def format_day(day: date) -> str:
    return day.strftime("%Y-%m-%d : %a")


def format_days(days: List[date]) -> str:
    return '[' + '\n '.join([format_day(day) for day in days]) + ']'


def format_values(values: List[Tuple[date, str]]) -> str:
    return '[' + '\n '.join([f'{format_day(day)} : {value}' for day, value in values]) + ']'
