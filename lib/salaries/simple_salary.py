from datetime import date

from lib.salaries.salary import Salary, SalaryPayment, ZERO_SALARY_PAYMENT


class SimpleSalary(Salary):
    day_of_the_month: int
    net: float
    health_insurance: float
    wage_tax: float

    def __init__(self, day_of_the_month: int, net: float, health_insurance: float, wage_tax: float):
        self.day_of_the_month = day_of_the_month
        self.net = net
        self.health_insurance = health_insurance
        self.wage_tax = wage_tax

    def next(self, current_date: date) -> SalaryPayment:
        if current_date.day == self.day_of_the_month:
            return SalaryPayment(
                gross=self.net + self.health_insurance + self.wage_tax,
                net=self.net,
                health_insurance=self.health_insurance,
                wage_tax=self.wage_tax,
            )
        return ZERO_SALARY_PAYMENT
