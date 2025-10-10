from pydantic import BaseModel


class ListItemType(BaseModel):
    value: str
    label: str
