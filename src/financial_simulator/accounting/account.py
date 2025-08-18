from dataclasses import dataclass, replace
from typing import Sequence, Self, Tuple

from .account_change import AccountChange
from .change import Change


@dataclass(frozen=True)
class Account:
    name: str
    changes: Sequence[AccountChange]
    sub_accounts: Sequence[Self]

    def __add_sub_account_if_new(self, sub_account_name: str) -> Self:
        if sub_account_name in (sub_account.name for sub_account in self.sub_accounts):
            return self
        return replace(self, sub_accounts=tuple(self.sub_accounts) + (Account(name=sub_account_name,
                                                                              changes=(),
                                                                              sub_accounts=()),))

    def __propagate_change(self, sub_account_name: str, transaction_index: int, change: Change) -> Self:
        return replace(self, sub_accounts=tuple(sub_account.__enter_change(transaction_index=transaction_index,
                                                                           change=change)
                                                if sub_account.name == sub_account_name
                                                else sub_account
                                                for sub_account
                                                in self.sub_accounts))

    def __add_change(self, transaction_index: int, change: Change) -> Self:
        return replace(self,
                       changes=tuple(self.changes) + (AccountChange(amount=change.amount,
                                                                    transaction_index=transaction_index),))

    def __enter_change(self,
                       transaction_index: int,
                       change: Change) -> Self:
        if len(change.account_path) == 0:
            return self.__add_change(transaction_index=transaction_index,
                                     change=change)
        sub_account_name = change.account_path[0]
        change = replace(change,
                         account_path=change.account_path[1:])
        return (self
                .__add_sub_account_if_new(sub_account_name=sub_account_name)
                .__propagate_change(sub_account_name=sub_account_name,
                                    transaction_index=transaction_index,
                                    change=change))

    def enter_transaction(self,
                          transaction_index: int,
                          changes: Sequence[Change]) -> Self:
        account = self
        for change in changes:
            account = account.__enter_change(transaction_index=transaction_index,
                                             change=change)
        return account

    def open_year(self) -> Tuple[Self, Sequence[Change]]:
        account_change = AccountChange(amount=sum(change.amount for change in self.changes),
                                       transaction_index=0)
        change = Change(amount=account_change.amount,
                        account_path=())
        sub_accounts_and_changes = tuple(sub_account.open_year() for sub_account in self.sub_accounts)
        return (replace(self,
                        changes=(account_change,),
                        sub_accounts=tuple(sub_account_and_changes[0]
                                           for sub_account_and_changes
                                           in sub_accounts_and_changes)),
                (change,) + tuple(replace(change,
                                          account_path=(sub_account_and_changes[0].name,) + tuple(change.account_path))
                                  for sub_account_and_changes
                                  in sub_accounts_and_changes
                                  for change
                                  in sub_account_and_changes[1]))
