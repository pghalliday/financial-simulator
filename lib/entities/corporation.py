from dataclasses import dataclass
from datetime import date
from typing import List

from lib.entities.entity import Entity, EntityState
from lib.salaries.salary import Salary, sum_salary_payments


@dataclass(frozen=True)
class CorporationState(EntityState):
    cash: float


class Corporation(Entity):
    salaries: List[Salary]

    def __init__(self,
                 salaries: List[Salary] = None):
        if salaries is None:
            salaries = []
        self.salaries = salaries

    def next(self, current_date: date, state: CorporationState) -> CorporationState:
        total_salary_payment = sum_salary_payments([salary.next(current_date) for salary in self.salaries])
        return CorporationState(
            cash=state.cash - total_salary_payment.gross
        )
