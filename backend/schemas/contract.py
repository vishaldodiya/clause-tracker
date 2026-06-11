from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID, uuid4
from datetime import datetime

class TagCreate(BaseModel):
    tag: str

class Tag(TagCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime

class ContractCreate(BaseModel):
    name: str
    tags: list[UUID] = []

class Contract(ContractCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime
    updated_at: datetime
    tags: list[Tag]


class ClauseCreate(BaseModel):
    contract_id: UUID
    paragraph_number: int
    sentence_number: int
    content: str
    label_id: UUID

class Clause(ClauseCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime
    updated_at: datetime


class LabelCreate(BaseModel):
    label: str

class Label(LabelCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime


class ContractTagCreate(BaseModel):
    contract_id: UUID
    tag_id: UUID

class ContractTag(ContractTagCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime
