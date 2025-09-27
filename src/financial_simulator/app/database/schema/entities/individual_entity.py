from typing import TYPE_CHECKING, List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from financial_simulator.app.database.schema.base import Base
from financial_simulator.app.database.schema.entities.entity import Entity

if TYPE_CHECKING:
    from financial_simulator.lib.bank_accounts import BankAccount
else:
    BankAccount = "BankAccount"


class IndividualEntity(Entity):
    __tablename__ = "individual_entity"

    id: Mapped[UUID] = mapped_column(ForeignKey("entity.id"), primary_key=True)

    bank_accounts: Mapped[List[BankAccount]] = relationship(
        secondary="individual_entity_bank_account",
        back_populates="individual_entities",
    )

    __mapper_args__ = {"polymorphic_identity": "individual_entity"}

class IndividualEntityBankAccount(Base):
    __tablename__ = "individual_entity_bank_account"

    individual_entity_id: Mapped[UUID] = mapped_column(ForeignKey("individual_entity.id"), primary_key=True)
    bank_account_id: Mapped[UUID] = mapped_column(ForeignKey("bank_account.id"), primary_key=True)
