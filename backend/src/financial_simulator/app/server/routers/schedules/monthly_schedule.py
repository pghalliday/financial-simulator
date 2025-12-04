from typing import Literal, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import MonthlySchedule, ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import (
    ScheduleGet,
    SchedulePost,
    add_schedule_model_fields,
)
from ...util.collection import Collection
from ...util.query_params import DefaultQueryParams


class MonthlySchedulePost(SchedulePost):
    type: Literal[ScheduleType.MONTHLY]
    day: int | None = None


class MonthlyScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.MONTHLY]
    day: int | None


monthly_schedule_model_mapper = ModelMapper(
    table_model=MonthlySchedule,
    get_model=MonthlyScheduleGet,
    post_model=MonthlySchedulePost,
)
(
    add_schedule_model_fields(monthly_schedule_model_mapper)
    .field("day", OrdinaryModelField())
)


class MonthlyScheduleQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return MonthlySchedule.name


router = APIRouter(
    prefix="/monthly-schedules",
    tags=["monthly-schedules"],
)


Collection(
    query_params_class=MonthlyScheduleQueryParams,
    model_mapper=monthly_schedule_model_mapper,
).add_endpoints(
    router=router,
)
