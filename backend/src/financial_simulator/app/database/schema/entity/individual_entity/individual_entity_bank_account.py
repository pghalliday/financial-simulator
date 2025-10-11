from uuid import UUID

from ...base import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column


class IndividualEntityBankAccount(Base):
    __tablename__ = "individual_entity_bank_account"

    individual_entity_id: Mapped[UUID] = mapped_column(
        ForeignKey("individual_entity.id"), primary_key=True
    )
    bank_account_id: Mapped[UUID] = mapped_column(
        ForeignKey("bank_account.id"), primary_key=True
    )
