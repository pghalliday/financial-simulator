from dataclasses import dataclass
from datetime import date
from typing import List

from lib.entities.entity import Entity, EntityState
from lib.salaries.salary import Salary, sum_salary_payments


@dataclass(frozen=True)
class IndividualState(EntityState):
    cash: float
    box_1_taxable_income: float
    box_1_tax_paid: float


class Individual(Entity):
    salaries: List[Salary]

    def __init__(self,
                 salaries: List[Salary] = None):
        if salaries is None:
            salaries = []
        self.salaries = salaries

    def next(self, current_date: date, state: IndividualState) -> IndividualState:
        total_salary_payment = sum_salary_payments([salary.next(current_date) for salary in self.salaries])
        return IndividualState(
            cash=state.cash + total_salary_payment.net,
            box_1_taxable_income=state.box_1_taxable_income + total_salary_payment.gross,
            box_1_tax_paid=state.box_1_taxable_income + total_salary_payment.wage_tax,
        )
