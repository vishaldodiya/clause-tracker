from models import ClauseModel
from sqlalchemy.orm import Session
from uuid import UUID

class ClauseQueries:
    @staticmethod
    def get_clauses(db: Session, contract_id: UUID) -> list[ClauseModel]:
        return db.query(ClauseModel).where(ClauseModel.contract_id == contract_id).all()