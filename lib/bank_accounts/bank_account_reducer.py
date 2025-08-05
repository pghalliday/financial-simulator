from calendar import JANUARY
from dataclasses import dataclass
from datetime import timedelta
from decimal import Decimal
from types import MappingProxyType

from .balance_change import BalanceChange
from .bank_account import BankAccount
from .interest_accrual import InterestAccrual
from .interest_application import InterestApplication
from ..providers import Provider, NeverProvider
from ..rates import Rate
from ..schedules import Schedule


@dataclass(frozen=True)
class BankAccountReducer:
    rate_provider: Provider[Rate] = NeverProvider()
    interest_payment_schedule: Schedule = NeverProvider()
    deposit_provider: Provider[MappingProxyType[str, Decimal]] = NeverProvider()
    withdrawal_provider: Provider[MappingProxyType[str, Decimal]] = NeverProvider()

    def next(self, state: BankAccount) -> BankAccount:
        # add one day to the current date
        current_date = state.current_date + timedelta(days=1)
        # start with the assumption that nothing else changed
        balance = state.balance
        balance_changes = state.balance_changes
        interest_applied = state.interest_applied
        interest_applications = state.interest_applications
        interest_accrued = state.interest_accrued
        interest_accruals = state.interest_accruals
        closing_balance = state.closing_balance
        opening_balance = state.opening_balance
        closing_interest_applied = state.closing_interest_applied
        opening_interest_applied = state.opening_interest_applied
        closing_interest_accrued = state.closing_interest_accrued
        opening_interest_accrued = state.opening_interest_accrued
        # if at the start of the year then update the closing and opening balances, etc.
        if current_date.month == JANUARY and current_date.day == 1:
            closing_balance = MappingProxyType(dict(closing_balance) | {state.current_date.year: state.balance})
            opening_balance = MappingProxyType(dict(opening_balance) | {current_date.year: state.balance})
            closing_interest_applied = MappingProxyType(
                dict(closing_interest_applied) | {state.current_date.year: state.interest_applied})
            opening_interest_applied = MappingProxyType(
                dict(opening_interest_applied) | {current_date.year: state.interest_applied})
            closing_interest_accrued = MappingProxyType(
                dict(closing_interest_accrued) | {state.current_date.year: state.interest_accrued})
            opening_interest_accrued = MappingProxyType(
                dict(opening_interest_accrued) | {current_date.year: state.interest_accrued})
        # Apply the accrued interest if it is an interest payment day
        if self.interest_payment_schedule.check(current_date):
            interest_applied += interest_accrued
            interest_applications += (InterestApplication(application_date=current_date,
                                                          amount=interest_accrued,
                                                          new_interest_applied=interest_applied),)
            balance += interest_accrued
            balance_changes += (BalanceChange(change_date=current_date,
                                              source='Interest',
                                              amount=interest_applied,
                                              new_balance=balance),)
            interest_accrued = Decimal('0.0')
        # Check for deposits
        deposits = self.deposit_provider.get(current_date)
        if deposits is not None:
            for label, amount in deposits.items():
                if amount is not None:
                    balance += amount
                    balance_changes += (BalanceChange(change_date=current_date,
                                                      source=f'Deposit: {label}',
                                                      amount=amount,
                                                      new_balance=balance),)
        # Check for withdrawals
        withdrawals = self.withdrawal_provider.get(current_date)
        if withdrawals is not None:
            for label, amount in withdrawals.items():
                if amount is not None:
                    balance -= amount
                    balance_changes += (BalanceChange(change_date=current_date,
                                                      source=f'Withdrawal: {label}',
                                                      amount=-amount,
                                                      new_balance=balance),)
        # Calculate interest on the new balance
        rate = self.rate_provider.get(current_date)
        if rate is not None:
            rate_calculation = rate.calculate(current_date, balance,
                                              interest_accrued)
            interest_accrued += rate_calculation.calculation
            interest_accruals += (InterestAccrual(accrual_date=current_date,
                                                  rate_calculation=rate_calculation,
                                                  new_interest_accrued=interest_accrued),)
        # Return the new state
        return BankAccount(current_date=current_date,
                           balance_changes=balance_changes,
                           interest_applications=interest_applications,
                           interest_accruals=interest_accruals,
                           balance=balance,
                           interest_applied=interest_applied,
                           interest_accrued=interest_accrued,
                           closing_balance=closing_balance,
                           opening_balance=opening_balance,
                           closing_interest_applied=closing_interest_applied,
                           opening_interest_applied=opening_interest_applied,
                           closing_interest_accrued=closing_interest_accrued,
                           opening_interest_accrued=opening_interest_accrued)
