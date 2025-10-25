from typing import Sequence, Mapping, Optional, TypeVar, Generic
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy.orm import Session

from financial_simulator.app.database.schema import BaseWithId
from ..get_optional_related_item import get_optional_related_item
from ..get_related_item import get_related_item
from .model_mapper import (
    ModelMapper,
    TABLE,
    GET,
    POST,
    PATCH,
)

RELATED_TABLE = TypeVar("RELATED_TABLE", bound=BaseWithId)


class FieldRelation(BaseModel, Generic[RELATED_TABLE]):
    field: str
    model: type[RELATED_TABLE]


class RelatedModelMapper(ModelMapper[TABLE, GET, POST, PATCH]):
    ordinary_fields: Sequence[str] = []
    related_fields: Mapping[str, FieldRelation] = {}
    optional_related_fields: Mapping[str, FieldRelation] = {}
    tree_children_fields: Sequence[str] = []
    tree_parent_fields: Sequence[str] = []

    def has_invalid_relation_error(self) -> bool:
        return len(self.related_fields.keys()) > 0 or len(self.optional_related_fields.keys()) > 0

    def map_get(self, item: TABLE, depth: int = 0, max_parents: int = 0) -> GET:
        params = {
            "id": item.id,
            **{field: getattr(item, field) for field in self.ordinary_fields},
            **{field: getattr(item, field) for field in self.related_fields.keys()},
            **{
                field: getattr(item, field)
                for field in self.optional_related_fields.keys()
            },
            **{
                field: [
                    self.map_get(sub_item, depth - 1, 0)
                    for sub_item in getattr(item, field)
                ]
                if (depth > 0 or depth < 0)
                else []
                for field in self.tree_children_fields
            },
            **{
                field: self.map_get(getattr(item, field), 0, max_parents - 1)
                if ((max_parents > 0 or max_parents < 0) and getattr(item, field))
                else None
                for field in self.tree_parent_fields
            },
        }
        return self.get_model(
            **params,
        )

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

    def map_patch(self, session: Session, item: TABLE, item_patch: POST) -> None:
        updated_data = item_patch.model_dump(exclude_unset=True)
        for key, value in updated_data.items():
            if key in self.ordinary_fields:
                setattr(item, key, value)
            if key in self.related_fields.keys():
                field_relation = self.related_fields[key]
                setattr(
                    item,
                    field_relation.field,
                    get_related_item(
                        session,
                        field_relation.model,
                        field_relation.field,
                        value,
                    ),
                )
            if key in self.optional_related_fields.keys():
                field_relation = self.optional_related_fields[key]
                setattr(
                    item,
                    field_relation.field,
                    get_optional_related_item(
                        session,
                        field_relation.model,
                        field_relation.field,
                        value,
                    ),
                )
