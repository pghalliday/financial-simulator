from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from typing import List, Tuple, Dict

from prettytable import PrettyTable, TableStyle

from .rate import Rate
from ..utils.bands import Band, create_bands


@dataclass(frozen=True)
class BandedRate(Rate):
    bands: List[Tuple[Band, Rate]]

    def __str__(self):
        table = PrettyTable(['Range', 'Rate'])
        table.set_style(TableStyle.SINGLE_BORDER)
        table.add_rows([[str(band), str(rate)] for band, rate in self.bands])
        return table.get_string()

    def calculate(self, current_date: date, balance: Decimal, accrued: Decimal) -> Decimal:
        return Decimal(sum([rate.calculate(current_date, *(band.portion([balance, accrued])))
                            for band, rate
                            in self.bands]))


def create_banded_rate(raw_bands: Dict[Decimal, Rate]) -> BandedRate:
    return BandedRate(create_bands(raw_bands))
