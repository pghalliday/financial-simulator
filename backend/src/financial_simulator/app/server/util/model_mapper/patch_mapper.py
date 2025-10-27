from typing import Dict

from sqlalchemy.orm import Session

from financial_simulator.app.server.util.model_mapper.fields import PatchField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    PATCH,
    PatchMapperInterface,
)


class PatchMapper(PatchMapperInterface[TABLE, PATCH]):
    table_model: type[TABLE]
    patch_model: type[PATCH]
    __fields: Dict[str, PatchField[TABLE] | None]

    def __init__(self, table_model: type[TABLE], patch_model: type[PATCH], fields: Dict[str, PatchField[TABLE]]):
        self.table_model = table_model
        self.patch_model = patch_model
        self.__fields = fields

    def map(self, session: Session, item: TABLE, item_patch: PATCH) -> None:
        updated_data = item_patch.model_dump(exclude_unset=True)
        for field, value in updated_data.items():
            patch_field = self.__fields[field]
            if patch_field is not None:
                patch_field.map(field, session, item, value)
