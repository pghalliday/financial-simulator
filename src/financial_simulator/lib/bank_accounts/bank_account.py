from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from typing import Sequence, Tuple, Self

from financial_simulator.lib.providers import Provider
from financial_simulator.lib.rates import Rate
from financial_simulator.lib.schedules import Schedule
from financial_simulator.lib.util.immutable import provider_get, schedule_check
from ..accounting import Books, Change, Transaction


@dataclass
class BankFee:
    description: str
    amount: Decimal


@dataclass(frozen=True)
class BankAccount:
    asset_account: Sequence[str]
    interest_income_account: Sequence[str]
    interest_receivable_account: Sequence[str]
    fee_expenses_account: Sequence[str]
    fees_payable_account: Sequence[str]
    fees_provider: Provider[BankFee] | None = None
    fee_payment_schedule: Schedule | None = None
    rate_provider: Provider[Rate] | None = None
    interest_payment_schedule: Schedule | None = None

    def __check_apply_interest(
        self, current_date: date, books: Books
    ) -> Tuple[Self, Books]:
        bank_account, scheduled = schedule_check(
            self, "interest_payment_schedule", current_date
        )
        if scheduled:
            interest_receivable = books.get_balance(
                bank_account.interest_receivable_account
            )
            return bank_account, books.enter_transaction(
                Transaction(
                    transaction_date=current_date,
                    description="Interest applied",
                    changes=(
                        Change(
                            amount=interest_receivable,
                            account_path=bank_account.interest_receivable_account,
                        ),
                        Change(
                            amount=-interest_receivable,
                            account_path=bank_account.asset_account,
                        ),
                    ),
                )
            )
        return bank_account, books

    def __accrue_interest(self, current_date: date, books: Books) -> Tuple[Self, Books]:
        bank_account, rates = provider_get(
            self, self.rate_provider, "rate_provider", current_date
        )
        if rates:
            rate_calculation = rates[0].calculate(
                current_date,
                books.get_balance(bank_account.asset_account),
                books.get_balance(bank_account.interest_receivable_account),
            )
            return bank_account, books.enter_transaction(
                Transaction(
                    transaction_date=current_date,
                    description="Interest accrued",
                    changes=(
                        Change(
                            amount=rate_calculation.accrued,
                            account_path=bank_account.interest_income_account,
                        ),
                        Change(
                            amount=-rate_calculation.accrued,
                            account_path=bank_account.interest_receivable_account,
                        ),
                    ),
                )
            )
        return bank_account, books

    def __check_apply_fees(
        self, current_date: date, books: Books
    ) -> Tuple[Self, Books]:
        bank_account, scheduled = schedule_check(
            self, "fee_payment_schedule", current_date
        )
        if scheduled:
            fees_payable = books.get_balance(bank_account.fees_payable_account)
            return bank_account, books.enter_transaction(
                Transaction(
                    transaction_date=current_date,
                    description="Fees applied",
                    changes=(
                        Change(
                            amount=-fees_payable,
                            account_path=bank_account.fees_payable_account,
                        ),
                        Change(
                            amount=fees_payable, account_path=bank_account.asset_account
                        ),
                    ),
                )
            )
        return bank_account, books

    def __enter_fee(self, current_date: date, fee: BankFee, books: Books) -> Books:
        return books.enter_transaction(
            Transaction(
                transaction_date=current_date,
                description=fee.description,
                changes=(
                    Change(amount=-fee.amount, account_path=self.fee_expenses_account),
                    Change(amount=fee.amount, account_path=self.fees_payable_account),
                ),
            )
        )

    def __accrue_fees(self, current_date: date, books: Books) -> Tuple[Self, Books]:
        bank_account, fees = provider_get(
            self, self.fees_provider, "fees_provider", current_date
        )
        for fee in fees:
            books = bank_account.__enter_fee(current_date, fee, books)
        return bank_account, books

    def on_tick(self, current_date: date, books: Books) -> Tuple[Self, Books]:
        bank_account, books = self.__accrue_interest(current_date, books)
        bank_account, books = bank_account.__accrue_fees(current_date, books)
        bank_account, books = bank_account.__check_apply_interest(current_date, books)
        return bank_account.__check_apply_fees(current_date, books)
