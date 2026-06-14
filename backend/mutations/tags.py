from datetime import datetime
from uuid import uuid4

from schemas.orm_models import TagModel
from schemas.pydantic_models import TagCreate
from sqlalchemy.orm import Session

class TagMutations:
    @staticmethod
    def create_tag(db: Session, tag_create: TagCreate) -> TagModel:
        tag = TagModel(
            id=uuid4(),
            name=tag_create.name,
            created_at=datetime.now()
        )
        db.add(tag)
        db.commit()
        db.refresh(tag)
        return tag