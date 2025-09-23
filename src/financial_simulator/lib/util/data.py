from datetime import date
from decimal import Decimal
from typing import Sequence, Tuple

import plotly.express as px
from pandas import DataFrame
from plotly.graph_objs import Figure

from financial_simulator.lib.entities import Entity


def extract_account_balances(days: Sequence[Tuple[date, Sequence[Entity]]],
                             account_path: Sequence[str],
                             columns: Sequence[str],
                             is_debit_account: bool = False) -> DataFrame:
    sign = Decimal('-1.0') if is_debit_account else Decimal('1.0')
    wide_data_frame = DataFrame.from_records(
        ((current_date,) + tuple(sign * entity.books.get_total_balance(account_path)
                                 for entity
                                 in entities)
         for current_date, entities
         in days),
        columns=('Date',) + tuple(columns))
    return wide_data_frame.melt(id_vars='Date',
                                value_vars=columns,
                                var_name='Entity',
                                value_name='Balance')


def plot_account_balances(days: Sequence[Tuple[date, Sequence[Entity]]],
                          account_path: Sequence[str],
                          columns: Sequence[str],
                          title: str,
                          is_debit_account: bool = False) -> Figure:
    return px.line(extract_account_balances(days=days,
                                            account_path=account_path,
                                            columns=columns,
                                            is_debit_account=is_debit_account),
                   x='Date',
                   y='Balance',
                   color='Entity',
                   title=title)
