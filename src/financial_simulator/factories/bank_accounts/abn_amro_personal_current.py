from decimal import Decimal

from financial_simulator.bank_accounts import BankAccount
from financial_simulator.providers import NeverProvider, ScheduledProvider
from financial_simulator.schedules import NeverSchedule, MonthlySchedule


def create_abn_amro_personal_current(name: str):
    return BankAccount(asset_account=('assets', 'bank_accounts', name),
                       interest_income_account=('income', 'assets', 'bank_accounts', 'interest', name),
                       interest_receivable_account=('receivable', 'bank_accounts', 'interest', name),
                       fee_expenses_account=('expenses', 'assets', 'bank_accounts', 'fees', name),
                       fees_payable_account=('payable', 'assets', 'bank_accounts', 'fees', name),
                       fees_provider=ScheduledProvider(schedule=MonthlySchedule(1),
                                                       value=Decimal('5.85')),
                       fee_payment_schedule=MonthlySchedule(15),
                       rate_provider=NeverProvider(),
                       interest_payment_schedule=NeverSchedule())
