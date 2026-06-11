from sqlalchemy.orm import Session
from mutations.clauses import ClauseMutations
from schemas.contract import ClauseUpdate
from queries.clauses import ClauseQueries
from models import ClauseModel

class ClauseController:
    @staticmethod
    def get_clauses(db: Session) -> list[ClauseModel]:
        return ClauseQueries.get_clauses(db=db)

    @staticmethod
    def update_clause(db: Session, clause_id: str, clause_data: ClauseUpdate) -> ClauseModel:
        return ClauseMutations.update_clause(db=db, clause_id=clause_id, clause_data=clause_data)