from typing import TYPE_CHECKING, List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from financial_simulator.app.database.schema.base import db

from .entity import Entity

if TYPE_CHECKING:
    from financial_simulator.app.database.schema.bank_account import BankAccount
else:
    BankAccount = "BankAccount"


class CorporationEntity(Entity):
    id: Mapped[UUID] = mapped_column(ForeignKey("entity.id"), primary_key=True)

    bank_accounts: Mapped[List[BankAccount]] = relationship(
        secondary="corporation_entity_bank_account",
        back_populates="corporation_entities",
    )

    __mapper_args__ = {"polymorphic_identity": "corporation_entity"}


class CorporationEntityBankAccount(db.Model):
    corporation_entity_id: Mapped[UUID] = mapped_column(
        ForeignKey("corporation_entity.id"), primary_key=True
    )
    bank_account_id: Mapped[UUID] = mapped_column(
        ForeignKey("bank_account.id"), primary_key=True
    )
