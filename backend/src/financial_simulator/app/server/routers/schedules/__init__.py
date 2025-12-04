from .schedules import router
from .daily_schedule import router as daily_schedule_router
from .day_schedule import router as day_schedule_router
from .weekly_schedule import router as weekly_schedule_router
from .monthly_schedule import router as monthly_schedule_router
from .yearly_schedule import router as yearly_schedule_router
from .from_schedule import router as from_schedule_router
from .until_schedule import router as until_schedule_router
from .range_schedule import router as range_schedule_router
from .all_schedule import router as all_schedule_router
from .any_schedule import router as any_schedule_router

__all__ = [
    "router",
    "daily_schedule_router",
    "day_schedule_router",
    "weekly_schedule_router",
    "monthly_schedule_router",
    "yearly_schedule_router",
    "from_schedule_router",
    "until_schedule_router",
    "range_schedule_router",
    "all_schedule_router",
    "any_schedule_router",
]
