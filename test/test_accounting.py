from datetime import date
from decimal import Decimal
from typing import Generator

from pytest import raises

from financial_simulator.accounting import Books, Account, Change, Transaction


def generate_books() -> Generator[Books, None, None]:
    books = Books(journal=(),
                  ledger=Account(name='Ledger',
                                 sub_accounts=()))
    yield books
    books = books.enter_transaction(transaction_date=date(2020, 1, 1),
                                    description='Test transaction 1',
                                    changes=(Change(amount=Decimal('100.0'),
                                                    account_path=('Test account 1',)),
                                             Change(amount=Decimal('-75.0'),
                                                    account_path=('Test account 1', 'Test account 1-1')),
                                             Change(amount=Decimal('-25.0'),
                                                    account_path=('Test account 2',))))
    yield books
    books = books.enter_transaction(transaction_date=date(2020, 1, 2),
                                    description='Test transaction 2',
                                    changes=(Change(amount=Decimal('-150.0'),
                                                    account_path=('Test account 1',)),
                                             Change(amount=Decimal('100.0'),
                                                    account_path=('Test account 1', 'Test account 1-1')),
                                             Change(amount=Decimal('50.0'),
                                                    account_path=('Test account 2',))))
    yield books
    books = books.open_journal(transaction_date=date(2020, 1, 3))
    yield books


def test_enter_transaction():
    books_iterator = generate_books()
    next(books_iterator)
    next(books_iterator)
    books = next(books_iterator)
    assert books == Books(journal=(Transaction(transaction_date=date(2020, 1, 1),
                                               description='Test transaction 1',
                                               changes=(Change(amount=Decimal('100.0'),
                                                               account_path=('Test account 1',)),
                                                        Change(amount=Decimal('-75.0'),
                                                               account_path=('Test account 1', 'Test account 1-1')),
                                                        Change(amount=Decimal('-25.0'),
                                                               account_path=('Test account 2',)))),
                                   Transaction(transaction_date=date(2020, 1, 2),
                                               description='Test transaction 2',
                                               changes=(Change(amount=Decimal('-150.0'),
                                                               account_path=('Test account 1',)),
                                                        Change(amount=Decimal('100.0'),
                                                               account_path=('Test account 1', 'Test account 1-1')),
                                                        Change(amount=Decimal('50.0'),
                                                               account_path=('Test account 2',))))),
                          ledger=Account(name='Ledger',
                                         sub_accounts=(Account(name='Test account 1',
                                                               sub_accounts=(Account(name='Test account 1-1',
                                                                                     sub_accounts=(),
                                                                                     balance=Decimal('25.0'),
                                                                                     total_balance=Decimal('25.0')),),
                                                               balance=Decimal('-50.0'),
                                                               total_balance=Decimal('-25.0')),
                                                       Account(name='Test account 2',
                                                               sub_accounts=(),
                                                               balance=Decimal('25.0'),
                                                               total_balance=Decimal('25.0')))))


def test_open_year():
    books_iterator = generate_books()
    next(books_iterator)
    next(books_iterator)
    next(books_iterator)
    books = next(books_iterator)
    assert books == Books(journal=(Transaction(transaction_date=date(2020, 1, 3),
                                               description='Open journal',
                                               changes=(Change(amount=Decimal('0.0'),
                                                               account_path=()),
                                                        Change(amount=Decimal('-50.0'),
                                                               account_path=('Test account 1',)),
                                                        Change(amount=Decimal('25.0'),
                                                               account_path=('Test account 1', 'Test account 1-1')),
                                                        Change(amount=Decimal('25.0'),
                                                               account_path=('Test account 2',)))),),
                          ledger=Account(name='Ledger',
                                         sub_accounts=(Account(name='Test account 1',
                                                               sub_accounts=(Account(name='Test account 1-1',
                                                                                     sub_accounts=(),
                                                                                     balance=Decimal('25.0'),
                                                                                     total_balance=Decimal('25.0')),),
                                                               balance=Decimal('-50.0'),
                                                               total_balance=Decimal('-25.0')),
                                                       Account(name='Test account 2',
                                                               sub_accounts=(),
                                                               balance=Decimal('25.0'),
                                                               total_balance=Decimal('25.0')),)))


def test_unbalanced_transaction():
    with raises(AssertionError, match='Credits and debits in transactions must balance: '):
        books_iterator = generate_books()
        books = next(books_iterator)
        books.enter_transaction(transaction_date=date(2020, 1, 1),
                                description='Unbalanced transaction',
                                changes=(Change(amount=Decimal('100.0'),
                                                account_path=('Test account 1',)),
                                         Change(amount=Decimal('-100.0'),
                                                account_path=('Test account 2',)),
                                         Change(amount=Decimal('-50.0'),
                                                account_path=('Test account 3',))))
