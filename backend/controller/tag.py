from sqlalchemy.orm import Session
from mutations.tags import TagMutations
from schemas.contract import Tag, TagCreate
from queries.tags import TagsQueries

class TagController:
    @staticmethod
    def get_tags(db: Session) -> list[Tag]:
        return TagsQueries.get_tags(db=db)
    
    @staticmethod
    def create_tag(db: Session, tag_create: TagCreate) -> Tag:
        tag = TagMutations.create_tag(db=db, tag_create=tag_create)
        return tag
