from datetime import date
from decimal import Decimal
from typing import List, Tuple, Dict


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


def print_bands(bands: Dict[Decimal, Decimal]) -> None:
    sorted_bands = sorted(bands.items(), reverse=True)
    rows = []
    row_count = len(sorted_bands)
    if row_count > 1:
        row_index = 0
        for lower, rate in sorted_bands:
            if row_index == 0:
                rows.append([f'above {lower:.2f}', f'{rate * 100:.2f}%'])
            else:
                rows.append([f'from {lower:.2f} to {upper:.2f}', f'{rate * 100:.2f}%'])
            upper = lower
            row_index += 1
