from datetime import date
from decimal import Decimal
from typing import Generator

from pytest import raises

from financial_simulator.accounting import Books, Account, Change, Transaction, AccountChange


def generate_books() -> Generator[Books, None, None]:
    books = Books(journal=(),
                  ledger=Account(name='Ledger',
                                 changes=(),
                                 sub_accounts=()))
    yield books
    books = books.enter_transaction(date=date(2020, 1, 1),
                                    description='Test transaction 1',
                                    changes=(Change(amount=Decimal('100.0'),
                                                    account_path=('Test account 1',)),
                                             Change(amount=Decimal('-75.0'),
                                                    account_path=('Test account 2',)),
                                             Change(amount=Decimal('-25.0'),
                                                    account_path=('Test account 3',))))
    yield books
    books = books.enter_transaction(date=date(2020, 1, 2),
                                    description='Test transaction 2',
                                    changes=(Change(amount=Decimal('-150.0'),
                                                    account_path=('Test account 1',)),
                                             Change(amount=Decimal('100.0'),
                                                    account_path=('Test account 2',)),
                                             Change(amount=Decimal('50.0'),
                                                    account_path=('Test account 3',))))
    yield books
    books = books.open_year(date=date(2020, 1, 3))
    yield books


def test_enter_transaction():
    books_iterator = generate_books()
    next(books_iterator)
    next(books_iterator)
    books = next(books_iterator)
    assert books == Books(journal=(Transaction(date=date(2020, 1, 1),
                                               description='Test transaction 1',
                                               changes=(Change(amount=Decimal('100.0'),
                                                               account_path=('Test account 1',)),
                                                        Change(amount=Decimal('-75.0'),
                                                               account_path=('Test account 2',)),
                                                        Change(amount=Decimal('-25.0'),
                                                               account_path=('Test account 3',)))),
                                   Transaction(date=date(2020, 1, 2),
                                               description='Test transaction 2',
                                               changes=(Change(amount=Decimal('-150.0'),
                                                               account_path=('Test account 1',)),
                                                        Change(amount=Decimal('100.0'),
                                                               account_path=('Test account 2',)),
                                                        Change(amount=Decimal('50.0'),
                                                               account_path=('Test account 3',))))),
                          ledger=Account(name='Ledger',
                                         changes=(),
                                         sub_accounts=(Account(name='Test account 1',
                                                               changes=(AccountChange(amount=Decimal('100.0'),
                                                                                      transaction_index=0),
                                                                        AccountChange(amount=Decimal('-150.0'),
                                                                                      transaction_index=1)),
                                                               sub_accounts=()),
                                                       Account(name='Test account 2',
                                                               changes=(AccountChange(amount=Decimal('-75.0'),
                                                                                      transaction_index=0),
                                                                        AccountChange(amount=Decimal('100.0'),
                                                                                      transaction_index=1)),
                                                               sub_accounts=()),
                                                       Account(name='Test account 3',
                                                               changes=(AccountChange(amount=Decimal('-25.0'),
                                                                                      transaction_index=0),
                                                                        AccountChange(amount=Decimal('50.0'),
                                                                                      transaction_index=1)),
                                                               sub_accounts=()))))


def test_open_year():
    books_iterator = generate_books()
    next(books_iterator)
    next(books_iterator)
    next(books_iterator)
    books = next(books_iterator)
    assert books == Books(journal=(Transaction(date=date(2020, 1, 3),
                                               description='Open year',
                                               changes=(Change(amount=Decimal('0.0'),
                                                               account_path=()),
                                                        Change(amount=Decimal('-50.0'),
                                                               account_path=('Test account 1',)),
                                                        Change(amount=Decimal('25.0'),
                                                               account_path=('Test account 2',)),
                                                        Change(amount=Decimal('25.0'),
                                                               account_path=('Test account 3',)))),),
                          ledger=Account(name='Ledger',
                                         changes=(AccountChange(amount=Decimal('0.0'),
                                                                transaction_index=0),),
                                         sub_accounts=(Account(name='Test account 1',
                                                               changes=(AccountChange(amount=Decimal('-50.0'),
                                                                                      transaction_index=0),),
                                                               sub_accounts=()),
                                                       Account(name='Test account 2',
                                                               changes=(AccountChange(amount=Decimal('25.0'),
                                                                                      transaction_index=0),),
                                                               sub_accounts=()),
                                                       Account(name='Test account 3',
                                                               changes=(AccountChange(amount=Decimal('25.0'),
                                                                                      transaction_index=0),),
                                                               sub_accounts=()))))


def test_unbalanced_transaction():
    with raises(AssertionError, match='Credits and debits in transactions must balance: '):
        books_iterator = generate_books()
        books = next(books_iterator)
        books.enter_transaction(date=date(2020, 1, 1),
                                        description='Unbalanced transaction',
                                        changes=(Change(amount=Decimal('100.0'),
                                                        account_path=('Test account 1',)),
                                                 Change(amount=Decimal('-100.0'),
                                                        account_path=('Test account 2',)),
                                                 Change(amount=Decimal('-50.0'),
                                                        account_path=('Test account 3',))))
