from typing import Sequence, TypeVar


from financial_simulator.app.database.schema import BaseWithId
from financial_simulator.app.server.util.model_mapper.get_mapper import (
    GetMapper,
    TABLE,
    GET,
)

RELATED_TABLE = TypeVar("RELATED_TABLE", bound=BaseWithId)


class RelatedGetMapper(GetMapper[TABLE, GET]):
    fields: Sequence[str] = []
    tree_children_fields: Sequence[str] = []
    tree_parent_fields: Sequence[str] = []

    def map_get(self, item: TABLE, depth: int = 0, max_parents: int = 0) -> GET:
        params = {
            "id": item.id,
            **{field: getattr(item, field) for field in self.fields},
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
