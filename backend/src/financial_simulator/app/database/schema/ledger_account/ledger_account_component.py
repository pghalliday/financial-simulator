from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from ..base import Base, HasId

class LedgerAccountComponent(Base, HasId):
    __tablename__ = "ledger_account_component"

    ledger_account_id: Mapped[UUID] = mapped_column(ForeignKey("ledger_account.id"))
    position: Mapped[int]
    name: Mapped[str]
