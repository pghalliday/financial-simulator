import logging
from typing import Union

from fastapi import APIRouter

from financial_simulator.app.database.schema import (
    Schedule,
)

from financial_simulator.app.server.routers.common.typed_collection import TypedCollection
from .all_schedule import AllScheduleGet, AllSchedulePost, all_schedule_model_mapper
from .any_schedule import AnyScheduleGet, AnySchedulePost, any_schedule_model_mapper
from .daily_schedule import (
    daily_schedule_model_mapper,
    DailyScheduleGet,
    DailySchedulePost,
)
from .day_schedule import (
    day_schedule_model_mapper,
    DayScheduleGet,
    DaySchedulePost,
)
from .from_schedule import (
    from_schedule_model_mapper,
    FromScheduleGet,
    FromSchedulePost,
)
from .monthly_schedule import (
    MonthlyScheduleGet,
    MonthlySchedulePost,
    monthly_schedule_model_mapper,
)
from .until_schedule import (
    until_schedule_model_mapper,
    UntilScheduleGet,
    UntilSchedulePost,
)
from .range_schedule import (
    range_schedule_model_mapper,
    RangeScheduleGet,
    RangeSchedulePost,
)
from .weekly_schedule import (
    WeeklyScheduleGet,
    WeeklySchedulePost,
    weekly_schedule_model_mapper,
)
from .yearly_schedule import (
    YearlyScheduleGet,
    YearlySchedulePost,
    yearly_schedule_model_mapper,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/schedules",
    tags=["schedules"],
)

TypedCollection(
    table_model=Schedule,
    order_by=Schedule.name,
    get_model=Union[
        DailyScheduleGet,
        DayScheduleGet,
        YearlyScheduleGet,
        MonthlyScheduleGet,
        WeeklyScheduleGet,
        FromScheduleGet,
        UntilScheduleGet,
        RangeScheduleGet,
        AllScheduleGet,
        AnyScheduleGet,
    ],
    post_model=Union[
        DailySchedulePost,
        DaySchedulePost,
        YearlySchedulePost,
        MonthlySchedulePost,
        WeeklySchedulePost,
        FromSchedulePost,
        UntilSchedulePost,
        RangeSchedulePost,
        AllSchedulePost,
        AnySchedulePost,
    ],
    model_mappers={
        "daily_schedule": daily_schedule_model_mapper,
        "day_schedule": day_schedule_model_mapper,
        "yearly_schedule": yearly_schedule_model_mapper,
        "monthly_schedule": monthly_schedule_model_mapper,
        "weekly_schedule": weekly_schedule_model_mapper,
        "from_schedule": from_schedule_model_mapper,
        "until_schedule": until_schedule_model_mapper,
        "range_schedule": range_schedule_model_mapper,
        "all_schedule": all_schedule_model_mapper,
        "any_schedule": any_schedule_model_mapper,
    },
).add_endpoints(
    router=router,
)
