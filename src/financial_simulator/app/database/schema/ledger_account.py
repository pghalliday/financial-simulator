from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import HasId, HasName, db


class LedgerAccountComponent(db.Model, HasId):
    ledger_account_id: Mapped[UUID] = mapped_column(ForeignKey("ledger_account.id"))
    position: Mapped[int]
    name: Mapped[str]


class LedgerAccount(db.Model, HasId, HasName):
    components: Mapped[List[LedgerAccountComponent]] = relationship(
        order_by="LedgerAccountComponent.position",
        collection_class=ordering_list("position"),
    )

    def __repr__(self) -> str:
        return f"LedgerAccount(id={self.id}, path={'/'.join(component.name for component in self.components)})"
