from datetime import date
from typing import Tuple, Sequence, TypeVar

T = TypeVar("T")


def format_day(day: date) -> str:
    return day.strftime("%Y-%m-%d : %a")


def format_days(days: Sequence[date]) -> str:
    return "[" + "\n ".join([format_day(day) for day in days]) + "]"


def format_provided(values: Sequence[Tuple[date, Sequence[T] | None]]) -> str:
    return (
        "["
        + "\n ".join([f"{format_day(day)} : {value}" for day, value in values])
        + "]"
    )
