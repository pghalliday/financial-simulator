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
class ContinuousRateCalculation(RateCalculation):
    rate: ContinuousRate
    daily_rate: Decimal

    @cache
    def __str__(self):
        table = PrettyTable(['label', 'value'])
        table.add_row(['Current date', format_day(self.current_date)])
        table.add_row(['Rate', str(self.rate)])
        table.add_row(['Daily rate', f'{self.daily_rate * 100:.6f}'])
        table.add_row(['Balance', f'{self.balance:.6f}'])
        table.add_row(['Accrued', f'{self.accrued:.6f}'])
        table.add_row(['Calculation', f'{self.calculation:.6f}'])
        table.set_style(TableStyle.SINGLE_BORDER)
        table.align['label'] = 'l'
        table.align['value'] = 'r'
        table.header = False
        return table.get_string()


@dataclass(frozen=True)
class ContinuousRate(Rate):
    annual_rate: Decimal

    @cache
    def __str__(self):
        return f'ContinuousRate: {self.annual_rate * 100:.2f}%'

    @cache
    def __daily_rate(self, year: int) -> Decimal:
        return ((1 + self.annual_rate) ** (1 / Decimal(days_in_year(year)))) - 1

    @cache
    def calculate(self, current_date: date, balance: Decimal, accrued: Decimal) -> ContinuousRateCalculation:
        daily_rate = self.__daily_rate(current_date.year)
        return ContinuousRateCalculation(rate=self,
                                         current_date=current_date,
                                         daily_rate=daily_rate,
                                         balance=balance,
                                         accrued=accrued,
                                         calculation=daily_rate * (balance + accrued))
