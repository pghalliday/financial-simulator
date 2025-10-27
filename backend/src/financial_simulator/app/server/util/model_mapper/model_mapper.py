from typing import TypeVar, Generic, Optional
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy.orm import Session

from financial_simulator.app.database.schema import BaseWithId
from financial_simulator.app.server.util.model_mapper.get_mapper import GetMapper
from financial_simulator.app.server.util.model_mapper.patch_mapper import PatchMapper
from financial_simulator.app.server.util.model_mapper.post_mapper import PostMapper

TABLE = TypeVar("TABLE", bound=BaseWithId)
GET = TypeVar("GET", bound=BaseModel)
POST = TypeVar("POST", bound=BaseModel)
PATCH = TypeVar("PATCH", bound=BaseModel)

class ModelMapper(Generic[TABLE, GET, POST, PATCH]):
    table_model: type[TABLE]
    get_model: type[GET]
    post_model: type[POST]
    patch_model: type[PATCH]
    has_invalid_relation_error: bool
    __get_mapper: GetMapper[TABLE, GET]
    __post_mapper: PostMapper[TABLE, POST]
    __patch_mapper: PatchMapper[TABLE, PATCH]

    def __init__(
            self,
            table_model: type[TABLE],
            get_model: type[GET],
            post_model: type[POST],
            patch_model: type[PATCH],
            has_invalid_relation_error: bool,
            get_mapper: GetMapper[TABLE, GET],
            post_mapper: PostMapper[TABLE, POST],
            patch_mapper: PatchMapper[TABLE, PATCH],
    ):
        self.table_model = table_model
        self.get_model = get_model
        self.post_model = post_model
        self.patch_model = patch_model
        self.has_invalid_relation_error = has_invalid_relation_error
        self.__get_mapper = get_mapper
        self.__post_mapper = post_mapper
        self.__patch_mapper = patch_mapper

    def map_get(self, item: TABLE, depth: int = 0, max_parents: int = 0) -> GET:
        return self.__get_mapper.map_get(item, depth, max_parents)

    def map_post(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        return self.__post_mapper.map_post(session, item_post, item_id)

    def map_patch(self, session: Session, item: TABLE, item_patch: PATCH) -> None:
        return self.__patch_mapper.patch_model(session, item, item_patch)
