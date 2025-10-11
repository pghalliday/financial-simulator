from typing import List

from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.orm import Mapped, relationship

from ..base import Base, HasId, HasName
from .ledger_account_component import LedgerAccountComponent


class LedgerAccount(Base, HasId, HasName):
    __tablename__ = "ledger_account"

    components: Mapped[List[LedgerAccountComponent]] = relationship(
        order_by="LedgerAccountComponent.position",
        collection_class=ordering_list("position"),
    )
