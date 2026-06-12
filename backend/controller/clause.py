from collections import defaultdict
from sqlalchemy.orm import Session
from mutations.clauses import ClauseMutations
from schemas.contract import ClauseUpdate
from queries.clauses import ClauseQueries
from models import ClauseModel
from schemas.contract import Paragraph

class ClauseController:
    @staticmethod
    def get_clauses(db: Session) -> list[Paragraph]:
        clauses = ClauseQueries.get_clauses(db=db)
        grouped: dict[int, list[ClauseModel]] = defaultdict(list)

        for clause in clauses:
            grouped[clause.paragraph_number].append(clause)

        return [
            Paragraph(paragraph_number=paragraph_number, clauses=clauses) for paragraph_number, clauses in grouped.items()
        ]


    @staticmethod
    def update_clause(db: Session, clause_id: str, clause_data: ClauseUpdate) -> ClauseModel:
        return ClauseMutations.update_clause(db=db, clause_id=clause_id, clause_data=clause_data)