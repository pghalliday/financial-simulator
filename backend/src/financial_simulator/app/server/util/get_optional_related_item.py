from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from financial_simulator.app.server.util.get_related_item import get_related_item


def get_optional_related_item[T](session: Session, table: type[T], relation_name: str, related_item_id: Optional[UUID]) -> T:
    if related_item_id is None:
        return None
    return get_related_item(session, table, relation_name, related_item_id)
