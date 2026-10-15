from pydantic import BaseModel, Field


class TodoCreate(BaseModel):
    title: str = Field(min_length=1)


class TodoUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None
