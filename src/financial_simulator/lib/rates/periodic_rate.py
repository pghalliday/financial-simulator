from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from functools import cache

from prettytable import PrettyTable, TableStyle

from financial_simulator.lib.util.date import days_in_year
from financial_simulator.lib.util.format import format_day
from .rate import Rate, RateCalculation


@dataclass(frozen=True)
class PeriodicRateCalculation(RateCalculation):
    rate: PeriodicRate
    daily_rate: Decimal

    @cache
    def __str__(self) -> str: # type: ignore
        table = PrettyTable(["label", "value"])
        table.add_row(["Current date", format_day(self.current_date)])
        table.add_row(["Rate", str(self.rate)])
        table.add_row(["Daily rate", f"{self.daily_rate * 100:.6f}"])
        table.add_row(["Balance", f"{self.balance:.6f}"])
        table.add_row(["Accrued", f"{self.accrued:.6f}"])
        table.add_row(["Calculation", f"{self.calculation:.6f}"])
        table.set_style(TableStyle.SINGLE_BORDER)
        table.align["label"] = "l"
        table.align["value"] = "r"
        table.header = False
        return table.get_string() # type: ignore


@dataclass(frozen=True)
class PeriodicRate(Rate):
    annual_rate: Decimal
    period_count: int

    @cache
    def __str__(self) -> str: # type: ignore
        return (
            f"PeriodicRate: {self.period_count} periods: {self.annual_rate * 100:.2f}%"
        )

    @cache
    def __daily_rate(self, year: int) -> Decimal:
        return (
            self.period_count
            * ((1 + self.annual_rate) ** (1 / Decimal(self.period_count)) - 1)
        ) / days_in_year(year)

    @cache
    def calculate( # type: ignore
        self, current_date: date, balance: Decimal, accrued: Decimal
    ) -> PeriodicRateCalculation:
        daily_rate = self.__daily_rate(current_date.year)
        return PeriodicRateCalculation(
            rate=self,
            current_date=current_date,
            daily_rate=daily_rate,
            balance=balance,
            accrued=accrued,
            calculation=daily_rate * balance,
        )
