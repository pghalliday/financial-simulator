from typing import Sequence

from sqlalchemy.orm import Session

from financial_simulator.app.server.util.model_mapper.patch_mapper import (
    PatchMapper,
    TABLE,
    PATCH,
)


class SimplePatchMapper(PatchMapper[TABLE, PATCH]):
    fields: Sequence[str] = []
    tree_children_fields: Sequence[str] = []
    tree_parent_fields: Sequence[str] = []

    def map_patch(self, session: Session, item: TABLE, item_patch: PATCH) -> None:
        updated_data = item_patch.model_dump(exclude_unset=True)
        for key, value in updated_data.items():
            setattr(item, key, value)
