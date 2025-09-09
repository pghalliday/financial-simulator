from calendar import JANUARY, APRIL, JULY, OCTOBER
from decimal import Decimal

from financial_simulator.bank_accounts import BankAccount
from financial_simulator.providers import NeverProvider, AlwaysProvider
from financial_simulator.rates import create_banded_rate, ContinuousRate
from financial_simulator.schedules import NeverSchedule, YearlySchedule, AllSchedule


def create_abn_amro_personal_savings(name: str):
    return BankAccount(asset_account=('assets', 'bank_accounts', name),
                       interest_income_account=('income', 'assets', 'bank_accounts', 'interest', name),
                       interest_receivable_account=('receivable', 'bank_accounts', 'interest', name),
                       fee_expenses_account=('expenses', 'assets', 'bank_accounts', 'fees', name),
                       fees_payable_account=('payable', 'assets', 'bank_accounts', 'fees', name),
                       fees_provider=NeverProvider(),
                       fee_payment_schedule=NeverSchedule(),
                       rate_provider=AlwaysProvider(create_banded_rate({Decimal('0.0'): ContinuousRate(Decimal('1.25')),
                                                                        Decimal('500000.0'): ContinuousRate(
                                                                            Decimal('1.45')),
                                                                        Decimal('1000000.0'): ContinuousRate(
                                                                            Decimal('0.0'))})),
                       interest_payment_schedule=AllSchedule((YearlySchedule(JANUARY, 1),
                                                              YearlySchedule(APRIL, 1),
                                                              YearlySchedule(JULY, 1),
                                                              YearlySchedule(OCTOBER, 1))))
