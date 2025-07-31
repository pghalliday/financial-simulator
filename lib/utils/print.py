from datetime import date
from typing import List, Tuple


def format_day(day: date) -> str:
    return day.strftime("%Y-%m-%d : %a")


def print_days(days: List[date]) -> None:
    print('[', end='')
    print(*[format_day(day) for day in days], end='', sep='\n ')
    print(']')


def print_values(values: List[Tuple[date, str]]) -> None:
    print('[', end='')
    print(*[f'{format_day(day)} : {value}' for day, value in values], end='', sep='\n ')
    print(']')
