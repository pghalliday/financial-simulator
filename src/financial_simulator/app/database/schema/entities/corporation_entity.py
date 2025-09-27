from typing import TYPE_CHECKING, List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from financial_simulator.app.database.schema.base import Base
from financial_simulator.app.database.schema.entities.entity import Entity

if TYPE_CHECKING:
    from financial_simulator.app.database.schema.bank_account import BankAccount
else:
    BankAccount = "BankAccount"


class CorporationEntity(Entity):
    __tablename__ = "corporation_entity"

    id: Mapped[UUID] = mapped_column(ForeignKey("entity.id"), primary_key=True)

    bank_accounts: Mapped[List[BankAccount]] = relationship(
        secondary="corporation_entity_bank_account",
        back_populates="corporation_entities",
    )

    __mapper_args__ = {"polymorphic_identity": "corporation_entity"}

class CorporationEntityBankAccount(Base):
    __tablename__ = "corporation_entity_bank_account"

    corporation_entity_id: Mapped[UUID] = mapped_column(ForeignKey("corporation_entity.id"), primary_key=True)
    bank_account_id: Mapped[UUID] = mapped_column(ForeignKey("bank_account.id"), primary_key=True)
