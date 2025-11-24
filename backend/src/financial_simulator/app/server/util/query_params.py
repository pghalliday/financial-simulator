from abc import abstractmethod, ABC
from typing import Union, TypeVar

from pydantic import BaseModel
from sqlalchemy import ColumnElement
from sqlalchemy.orm import InstrumentedAttribute


class QueryParams(BaseModel, ABC):
    @abstractmethod
    def query_limit(self) -> int | None:
        raise NotImplementedError()

    @abstractmethod
    def query_offset(self) -> int | None:
        raise NotImplementedError()

    @abstractmethod
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        raise NotImplementedError()

    @abstractmethod
    def query_where(self) -> Union[ColumnElement[bool], None]:
        raise NotImplementedError()


QUERY_PARAMS = TypeVar("QUERY_PARAMS", bound=QueryParams)


class DefaultQueryParams(QueryParams):
    def query_limit(self) -> int | None:
        return None

    def query_offset(self) -> int | None:
        return None

    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return None

    def query_where(self) -> Union[ColumnElement[bool], None]:
        return None