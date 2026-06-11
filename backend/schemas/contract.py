import json
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID, uuid4
from datetime import datetime
from fastapi import Form

class TagCreate(BaseModel):
    name: str

class Tag(TagCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime

class ContractCreate(BaseModel):
    name: str
    tags: list[UUID] = []

    @classmethod
    def as_form(cls, name: str = Form(...), tags: list[UUID] = Form(default=[])) -> "ContractCreate":
        return cls(name=name, tags=tags)

class Contract(ContractCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime
    updated_at: datetime
    tags: list[Tag]


class ClauseUpdate(BaseModel):
    label_id: UUID | None = None

class Clause(ClauseUpdate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime
    updated_at: datetime
    paragraph_number: int
    sentence_number: int
    content: str
    label_id: UUID | None


class LabelCreate(BaseModel):
    name: str

class Label(LabelCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID = Field(default_factory=uuid4)
    name: str
    created_at: datetime


class ContractTagCreate(BaseModel):
    contract_id: UUID
    tag_id: UUID

class ContractTag(ContractTagCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime
