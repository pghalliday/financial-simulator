from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import BaseWithId

if TYPE_CHECKING:
    from .ledger_account import LedgerAccount
else:
    LedgerAccount = "LedgerAccount"


class LedgerAccountComponent(BaseWithId):
    __tablename__ = "ledger_account_component"

    ledger_account_id: Mapped[UUID] = mapped_column(ForeignKey("ledger_account.id"))
    position: Mapped[int]
    name: Mapped[str]

    ledger_account: Mapped[LedgerAccount] = relationship(
        back_populates="components",
    )
