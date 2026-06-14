from sqlalchemy.orm import Session
from schemas.orm_models import TagModel

class TagsQueries:
    @staticmethod
    def get_tags(db: Session) -> list[TagModel]:
        return db.query(TagModel).all()