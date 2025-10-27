from typing import Sequence, Mapping, Optional
from uuid import UUID

from sqlalchemy.orm import Session

from financial_simulator.app.server.util.model_mapper.related.field_relation import FieldRelation
from financial_simulator.app.server.util.get_optional_related_item import get_optional_related_item
from financial_simulator.app.server.util.get_related_item import get_related_item
from financial_simulator.app.server.util.model_mapper.post_mapper import (
    PostMapper,
    TABLE,
    POST,
)

class RelatedPostMapper(PostMapper[TABLE, POST]):
    ordinary_fields: Sequence[str] = []
    related_fields: Mapping[str, FieldRelation] = {}
    optional_related_fields: Mapping[str, FieldRelation] = {}
    tree_children_fields: Sequence[str] = []
    tree_parent_fields: Sequence[str] = []

    def map_post(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        if item_id is not None:
            id_params = {"id": item_id}
        else:
            id_params = {}
        params = {
            **id_params,
            **{field: getattr(item_post, field) for field in self.ordinary_fields},
            **{related_field.field: get_related_item(
                session,
                related_field.model,
                related_field.field,
                getattr(item_post, id_field)
            ) for id_field, related_field in self.related_fields.items()},
            **{related_field.field: get_optional_related_item(
                session,
                related_field.model,
                related_field.field,
                getattr(item_post, id_field)
            ) for id_field, related_field in self.optional_related_fields.items()},
        }
        return self.table_model(
            **params,
        )
