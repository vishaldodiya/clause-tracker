from sqlalchemy.orm import Session
from models import TagModel

class TagsQueries:
    @staticmethod
    def get_tags(db: Session) -> list[TagModel]:
        return db.query(TagModel).all()