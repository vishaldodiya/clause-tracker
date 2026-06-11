from models import ClauseModel
from sqlalchemy.orm import Session


class ClauseQueries:
    @staticmethod
    def get_clauses(db: Session) -> list[ClauseModel]:
        return db.query(ClauseModel).all()