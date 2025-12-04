from datetime import date
from typing import Literal, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import FromSchedule, ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields
from ...util.collection import Collection
from ...util.query_params import DefaultQueryParams


class FromSchedulePost(SchedulePost):
    type: Literal[ScheduleType.FROM]
    from_date: date | None = None


class FromScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.FROM]
    from_date: date | None


from_schedule_model_mapper = ModelMapper(
    table_model=FromSchedule,
    get_model=FromScheduleGet,
    post_model=FromSchedulePost,
)
(
    add_schedule_model_fields(from_schedule_model_mapper)
    .field("from_date", OrdinaryModelField())
)


class FromScheduleQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return FromSchedule.name


router = APIRouter(
    prefix="/from-schedules",
    tags=["from-schedules"],
)


Collection(
    query_params_class=FromScheduleQueryParams,
    model_mapper=from_schedule_model_mapper,
).add_endpoints(
    router=router,
)
