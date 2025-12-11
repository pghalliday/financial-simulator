from typing import List

from sqlalchemy.orm import Session

from financial_simulator.app.database.schema import LedgerAccount


def add_assets(session: Session, log: List[str]):
    log.append('Adding assets')
    session.add(LedgerAccount(
        account_name="Assets",
        name="Assets",
        description="Assets",
        sub_accounts=[
            LedgerAccount(
                account_name="Bank Accounts",
                name="Assets / Bank Accounts",
                description="Assets / Bank Accounts",
            ),
        ]
    ))


def add_liabilities(session: Session, log: List[str]):
    log.append('Adding liabilities')
    session.add(
        LedgerAccount(
            account_name="Liabilities",
            name="Liabilities",
            description="Liabilities",
            sub_accounts=[
            ],
        )
    )


def add_income(session: Session, log: List[str]):
    log.append('Adding income')
    session.add(LedgerAccount(
        account_name="Income",
        name="Income",
        description="Income",
        sub_accounts=[
            LedgerAccount(
                account_name="Bank Accounts",
                name="Income / Bank Accounts",
                description="Income / Bank Accounts",
                sub_accounts=[
                    LedgerAccount(
                        account_name="Interest",
                        name="Income / Bank Accounts / Interest",
                        description="Income / Bank Accounts / Interest",
                    ),
                ]
            ),
        ]
    ))


def add_expenses(session: Session, log: List[str]):
    log.append('Adding expenses')
    session.add(LedgerAccount(
        account_name="Expenses",
        name="Expenses",
        description="Expenses",
        sub_accounts=[
            LedgerAccount(
                account_name="Bank Accounts",
                name="Expenses / Bank Accounts",
                description="Expenses / Bank Accounts",
                sub_accounts=[
                    LedgerAccount(
                        account_name="Fees",
                        name="Expenses / Bank Accounts / Fees",
                        description="Expenses / Bank Accounts / Fees",
                    ),
                ]
            ),
        ]
    ))


def add_receivable(session: Session, log: List[str]):
    log.append('Adding receivables')
    session.add(LedgerAccount(
        account_name="Receivable",
        name="Receivable",
        description="Receivable",
        sub_accounts=[
            LedgerAccount(
                account_name="Bank Accounts",
                name="Receivable / Bank Accounts",
                description="Receivable / Bank Accounts",
                sub_accounts=[
                    LedgerAccount(
                        account_name="Interest",
                        name="Receivable / Bank Accounts / Interest",
                        description="Receivable / Bank Accounts / Interest",
                    ),
                ]
            ),
        ]
    ))


def add_payable(session: Session, log: List[str]):
    log.append('Adding payables')
    session.add(LedgerAccount(
        account_name="Payable",
        name="Payable",
        description="Payable",
        sub_accounts=[
            LedgerAccount(
                account_name="Bank Accounts",
                name="Payable / Bank Accounts",
                description="Payable / Bank Accounts",
                sub_accounts=[
                    LedgerAccount(
                        account_name="Fees",
                        name="Payable / Bank Accounts / Fees",
                        description="Payable / Bank Accounts / Fees",
                    ),
                ]
            ),
        ]
    ))


def add_ledger_accounts(session: Session, log: List[str]):
    log.append('Adding ledger accounts')
    add_assets(session, log)
    add_liabilities(session, log)
    add_income(session, log)
    add_expenses(session, log)
    add_receivable(session, log)
    add_payable(session, log)
