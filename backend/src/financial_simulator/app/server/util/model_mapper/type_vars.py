from typing import TypeVar

from pydantic import BaseModel

from financial_simulator.app.database.schema import NamedAssociation, BaseWithId, Base

TABLE = TypeVar('TABLE', bound=BaseWithId)
GET = TypeVar('GET', bound=BaseModel)
POST = TypeVar('POST', bound=BaseModel)
RELATED_TABLE = TypeVar("RELATED_TABLE", bound=BaseWithId)
RELATED_GET = TypeVar('RELATED_GET', bound=BaseModel)
RELATED_POST = TypeVar('RELATED_POST', bound=BaseModel)
ASSOCIATION_TABLE = TypeVar('ASSOCIATION_TABLE', bound=Base)
NAMED_ASSOCIATION_TABLE = TypeVar('NAMED_ASSOCIATION_TABLE', bound=NamedAssociation)
