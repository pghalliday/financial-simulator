from .entities import router
from .individual_entity import router as individual_entity_router
from .corporation_entity import router as corporation_entity_router

__all__ = [
    "router",
    "individual_entity_router",
    "corporation_entity_router",
]
