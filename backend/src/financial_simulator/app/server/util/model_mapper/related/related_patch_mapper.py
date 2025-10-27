from typing import Sequence, Mapping

from sqlalchemy.orm import Session

from financial_simulator.app.server.util.model_mapper.related.field_relation import FieldRelation
from financial_simulator.app.server.util.get_optional_related_item import get_optional_related_item
from financial_simulator.app.server.util.get_related_item import get_related_item
from financial_simulator.app.server.util.model_mapper.patch_mapper import (
    PatchMapper,
    TABLE,
    PATCH,
)

class RelatedPatchMapper(PatchMapper[TABLE, PATCH]):
    ordinary_fields: Sequence[str] = []
    related_fields: Mapping[str, FieldRelation] = {}
    optional_related_fields: Mapping[str, FieldRelation] = {}
    tree_children_fields: Sequence[str] = []
    tree_parent_fields: Sequence[str] = []

    def map_patch(self, session: Session, item: TABLE, item_patch: PATCH) -> None:
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
