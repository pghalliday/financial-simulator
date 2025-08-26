from __future__ import annotations

from calendar import JANUARY
from dataclasses import dataclass, replace
from decimal import Decimal
from types import MappingProxyType
from typing import Sequence, Mapping, Tuple, Self

from financial_simulator.core import Event, Actor, Action
from prettytable import PrettyTable, TableStyle

from financial_simulator.providers import Provider
from financial_simulator.rates import Rate
from financial_simulator.schedules import Schedule
from financial_simulator.util.format import format_day
from .balance_change import BalanceChange
from .interest_accrual import InterestAccrual
from .interest_application import InterestApplication


@dataclass(frozen=True)
class BankEvent(Event):
    pass


@dataclass(frozen=True)
class BankAction(Action):
    pass


@dataclass(frozen=True)
class DepositAction(BankAction):
    amount: Decimal


@dataclass(frozen=True)
class WithdrawalAction(BankAction):
    amount: Decimal


@dataclass(frozen=True)
class BankAccount(Actor[BankEvent, BankAction]):
    rate_provider: Provider[Rate] | None = None
    interest_payment_schedule: Schedule | None = None
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

    def new_year(self) -> BankAccount:
        if self.current_date.month == JANUARY and self.current_date.day == 1:
            return replace(self,
                           closing_balance=MappingProxyType(
                               dict(self.closing_balance) | {self.current_date.year - 1: self.balance}),
                           closing_interest_applied=MappingProxyType(
                               dict(self.closing_interest_applied) | {
                                   self.current_date.year - 1: self.interest_applied}),
                           closing_interest_accrued=MappingProxyType(
                               dict(self.closing_interest_accrued) | {
                                   self.current_date.year - 1: self.interest_accrued}),
                           opening_balance=MappingProxyType(
                               dict(self.opening_balance) | {self.current_date.year: self.balance}),
                           opening_interest_applied=MappingProxyType(
                               dict(self.opening_interest_applied) | {self.current_date.year: self.interest_applied}),
                           opening_interest_accrued=MappingProxyType(
                               dict(self.opening_interest_accrued) | {self.current_date.year: self.interest_accrued}))
        return self

    def apply_interest(self) -> BankAccount:
        new_interest_applied = self.interest_applied + self.interest_accrued
        new_balance = self.balance + self.interest_accrued
        return replace(self,
                       interest_applied=new_interest_applied,
                       interest_applications=tuple(self.interest_applications) + (
                           InterestApplication(application_date=self.current_date,
                                               amount=self.interest_accrued,
                                               new_interest_applied=new_interest_applied),),
                       balance=new_balance,
                       balance_changes=tuple(self.balance_changes) + (BalanceChange(change_date=self.current_date,
                                                                                    source='Interest',
                                                                                    amount=self.interest_accrued,
                                                                                    new_balance=new_balance),),
                       interest_accrued=Decimal('0.0'))

    def check_apply_interest(self) -> BankAccount:
        if self.interest_payment_schedule is None:
            return self
        schedule_and_scheduled = self.interest_payment_schedule.check(self.current_date)
        if schedule_and_scheduled is None:
            return replace(self, interest_payment_schedule=None)
        schedule, scheduled = schedule_and_scheduled
        bank_account = replace(self, interest_payment_schedule=schedule)
        if scheduled:
            return bank_account.apply_interest()
        return bank_account

    def apply_deposit(self, label: str, amount: Decimal) -> BankAccount:
        new_balance = self.balance + amount
        return replace(self,
                       balance=new_balance,
                       balance_changes=tuple(self.balance_changes) + (
                           BalanceChange(change_date=self.current_date,
                                         source=f'Deposit: {label}',
                                         amount=amount,
                                         new_balance=new_balance),))

    def apply_withdrawal(self, label: str, amount: Decimal) -> BankAccount:
        new_balance = self.balance - amount
        return replace(self,
                       balance=new_balance,
                       balance_changes=tuple(self.balance_changes) + (
                           BalanceChange(change_date=self.current_date,
                                         source=f'Withdrawal: {label}',
                                         amount=-amount,
                                         new_balance=new_balance),))

    def get_rates(self) -> Tuple[BankAccount, Sequence[Rate]]:
        if self.rate_provider is None:
            return self, ()
        provided = self.rate_provider.get(self.current_date)
        if provided is None:
            return replace(self, rate_provider=None), ()
        provider, rates = provided
        return replace(self, rate_provider=provider), rates

    def accrue_interest(self) -> BankAccount:
        bank_account, rates = self.get_rates()
        if rates:
            rate_calculation = rates[0].calculate(bank_account.current_date, bank_account.balance,
                                                  bank_account.interest_accrued)
            new_interest_accrued = bank_account.interest_accrued + rate_calculation.calculation
            return replace(bank_account,
                           interest_accrued=new_interest_accrued,
                           interest_accruals=tuple(self.interest_accruals) + (
                               InterestAccrual(accrual_date=self.current_date,
                                               rate_calculation=rate_calculation,
                                               new_interest_accrued=new_interest_accrued),))
        return replace(bank_account)

    def on_action(self, action: BankAction) -> Tuple[Self, Sequence[BankEvent]]:
        if isinstance(action, DepositAction):
            return self.apply_deposit('/'.join(action.source), action.amount), ()
        if isinstance(action, WithdrawalAction):
            return self.apply_withdrawal('/'.join(action.source), action.amount), ()
        return self, ()

    def on_tick(self) -> Tuple[Self, Sequence[BankEvent]]:
        return (self
                # If at the start of the year then close the previous year and open the new year
                .new_year()
                # Calculate interest on the opening balance
                .accrue_interest()
                # Apply the accrued interest if it is an interest payment day
                .check_apply_interest(), ())
