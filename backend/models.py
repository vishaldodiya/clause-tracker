from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase

from uuid import UUID

class Base(DeclarativeBase):
    pass

class ContractModel(Base):
    __tablename__ = "contract"

    id: Mapped[UUID] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now)
    tags: Mapped[list["TagModel"]] = relationship("TagModel", secondary="contract_tags", viewonly=True)

class ClauseModel(Base):
    __tablename__ = "clause"

    id: Mapped[UUID] = mapped_column(primary_key=True)
    contract_id: Mapped[UUID] = mapped_column(ForeignKey("contract.id"))
    paragraph_number: Mapped[int] = mapped_column(Integer)
    sentence_number: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(String(2000))
    label_id: Mapped[UUID] = mapped_column(ForeignKey("labels.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now)

class LabelModel(Base):
    __tablename__ = "labels"

    id: Mapped[UUID] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

class TagModel(Base):
    __tablename__ = "tags"

    id: Mapped[UUID] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

class ContractTagModel(Base):
    __tablename__ = "contract_tags"

    id: Mapped[UUID] = mapped_column(primary_key=True)
    contract_id: Mapped[UUID] = mapped_column(ForeignKey("contract.id"))
    tag_id: Mapped[UUID] = mapped_column(ForeignKey("tags.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    UniqueConstraint("contract_id", "tag_id", name="uix_contract_tag")