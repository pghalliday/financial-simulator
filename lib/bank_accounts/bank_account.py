from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from types import MappingProxyType
from typing import Sequence, Mapping

from prettytable import PrettyTable, TableStyle

from .balance_change import BalanceChange
from .interest_accrual import InterestAccrual
from .interest_application import InterestApplication
from ..utils.format import format_day


@dataclass(frozen=True)
class BankAccount:
    current_date: date = date.today()
    balance_changes: Sequence[BalanceChange] = ()
    interest_applications: Sequence[InterestApplication] = ()
    interest_accruals: Sequence[InterestAccrual] = ()
    balance: Decimal = Decimal('0.0')
    interest_applied: Decimal = Decimal('0.0')
    interest_accrued: Decimal = Decimal('0.0')
    closing_balance: Mapping[int, Decimal] = MappingProxyType({})
    opening_balance: Mapping[int, Decimal] = MappingProxyType({})
    closing_interest_applied: Mapping[int, Decimal] = MappingProxyType({})
    opening_interest_applied: Mapping[int, Decimal] = MappingProxyType({})
    closing_interest_accrued: Mapping[int, Decimal] = MappingProxyType({})
    opening_interest_accrued: Mapping[int, Decimal] = MappingProxyType({})

    def __str__(self):
        table = PrettyTable(['label', 'value'])
        table.add_row(['Current date', format_day(self.current_date)])
        table.add_row(['Interest applied', f'{self.interest_applied:.6f}'])
        table.add_row(['Interest accrued', f'{self.interest_accrued:.6f}'])
        table.add_row(['Balance', f'{self.balance:.6f}'])
        table.add_row(['Total', f'{self.balance + self.interest_accrued:.6f}'])
        table.set_style(TableStyle.SINGLE_BORDER)
        table.align['label'] = 'l'
        table.align['value'] = 'r'
        table.header = False
        return table.get_string()
