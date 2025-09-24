from dataclasses import dataclass, replace
from decimal import Decimal
from typing import Sequence, Self

from .change import Change


@dataclass(frozen=True)
class Account:
    name: str
    sub_accounts: Sequence[Self]
    balance: Decimal = Decimal("0.0")
    total_balance: Decimal = Decimal("0.0")

    def __add_sub_account_if_new(self, sub_account_name: str) -> Self:
        if sub_account_name in (sub_account.name for sub_account in self.sub_accounts):
            return self
        return replace(
            self,
            sub_accounts=tuple(self.sub_accounts)
            + (Account(name=sub_account_name, sub_accounts=()),),
        )

    def __propagate_change(self, sub_account_name: str, change: Change) -> Self:
        return replace(
            self,
            sub_accounts=tuple(
                sub_account.__enter_change(change)
                if sub_account.name == sub_account_name
                else sub_account
                for sub_account in self.sub_accounts
            ),
        )

    def __enter_change(self, change: Change) -> Self:
        account = replace(self, total_balance=self.total_balance + change.amount)
        if len(change.account_path) == 0:
            return replace(account, balance=self.balance + change.amount)
        sub_account_name = change.account_path[0]
        change = replace(change, account_path=change.account_path[1:])
        return account.__add_sub_account_if_new(
            sub_account_name=sub_account_name
        ).__propagate_change(sub_account_name=sub_account_name, change=change)

    def enter_transaction(self, changes: Sequence[Change]) -> Self:
        account = self
        for change in changes:
            account = account.__enter_change(change=change)
        return account

    def get_open_changes(self) -> Sequence[Change]:
        change = Change(amount=self.balance, account_path=())
        sub_accounts_and_changes = tuple(
            (sub_account.name, sub_account.get_open_changes())
            for sub_account in self.sub_accounts
        )
        return (change,) + tuple(
            replace(
                change,
                account_path=(sub_account_and_changes[0],) + tuple(change.account_path),
            )
            for sub_account_and_changes in sub_accounts_and_changes
            for change in sub_account_and_changes[1]
        )

    def get_balance(self, account_path: Sequence[str]) -> Decimal:
        if account_path:
            for sub_account in self.sub_accounts:
                if sub_account.name == account_path[0]:
                    return sub_account.get_balance(account_path[1:])
            # for unknown accounts, we will return zero
            return Decimal("0.0")
        return self.balance

    def get_total_balance(self, account_path: Sequence[str]) -> Decimal:
        if account_path:
            for sub_account in self.sub_accounts:
                if sub_account.name == account_path[0]:
                    return sub_account.get_total_balance(account_path[1:])
            # for unknown accounts, we will return zero
            return Decimal("0.0")
        return self.total_balance
