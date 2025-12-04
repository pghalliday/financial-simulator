from datetime import date
from typing import Literal, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    RangeSchedule,
    ScheduleType,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields
from ...util.collection import Collection
from ...util.query_params import DefaultQueryParams


class RangeSchedulePost(SchedulePost):
    type: Literal[ScheduleType.RANGE]
    from_date: date | None = None
    until_date: date | None = None


class RangeScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.RANGE]
    from_date: date | None
    until_date: date | None


range_schedule_model_mapper = ModelMapper(
    table_model=RangeSchedule,
    get_model=RangeScheduleGet,
    post_model=RangeSchedulePost,
)
(
    add_schedule_model_fields(range_schedule_model_mapper)
    .field("from_date", OrdinaryModelField())
    .field("until_date", OrdinaryModelField())
)


class RangeScheduleQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return RangeSchedule.name


router = APIRouter(
    prefix="/range-schedules",
    tags=["range-schedules"],
)


Collection(
    query_params_class=RangeScheduleQueryParams,
    model_mapper=range_schedule_model_mapper,
).add_endpoints(
    router=router,
)
