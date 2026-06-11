from datetime import datetime

from backend.schemas.contract import Tag, TagCreate
from sqlalchemy.orm import Session

class TagMutations:
    @staticmethod
    def create_tag(db: Session, tag_create: TagCreate) -> Tag:
        tag = Tag(
            tag=tag_create.tag,
            created_at=datetime.now()
        ) 
        db.add(tag)
        db.commit()
        db.refresh(tag)
        return tag

    @staticmethod
    def get_tags(db: Session) -> list[Tag]:
        return db.query(Tag).all()