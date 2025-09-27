from typing import List
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import mapped_column, Mapped, relationship

from financial_simulator.app.database.schema import Base

class LedgerAccountComponent(Base):
    __tablename__ = 'ledger_account_component'
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    ledger_account_id: Mapped[UUID] = mapped_column(ForeignKey('ledger_account.id'))
    position: Mapped[int]
    name: Mapped[str]

class LedgerAccount(Base):
    __tablename__ = 'ledger_account'

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)

    components: Mapped[List[LedgerAccountComponent]] = relationship(
        order_by='LedgerAccountComponent.position',
        collection_class=ordering_list('position'),
    )

    def __repr__(self) -> str:
        return f'LedgerAccount(id={self.id}, path={'/'.join(component.name for component in self.components)})'
