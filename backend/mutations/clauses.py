import re
from uuid import UUID, uuid4
from sqlalchemy.orm import Session
from schemas.contract import ClauseUpdate, Clause
from models import ClauseModel

class ClauseMutations:
    @staticmethod
    def create_clauses(db: Session, contract_id: UUID, content: str):
        clauses = ClauseMutations.extract_clauses_from_file(contract_id, content)
        db.add_all(clauses)

    @staticmethod
    def extract_clauses_from_file(contract_id: UUID, context: str) -> list[ClauseModel]:
        paragraphs = context.split("\n\n")
        clauses = []
        for paragraph_number, paragraph in enumerate(paragraphs):
            sentences = re.split(r'(?<=[.?!])\s+', paragraph.strip())
            for sentence_number, sentence in enumerate(sentences):
                clause_data = ClauseModel(
                    id=uuid4(),
                    contract_id=contract_id,
                    content=sentence,
                    paragraph_number=paragraph_number,
                    sentence_number=sentence_number
                )
                clauses.append(clause_data)
        return clauses
    
    @staticmethod
    def update_clause(db: Session, clause_id: UUID, clause_data: ClauseUpdate) -> ClauseModel:
        clause = db.get(ClauseModel, clause_id)
        if clause is None:
            raise ValueError(f"Clause with id {clause_id} not found")
        
        clause.label_id = clause_data.label_id
        db.commit()
        db.refresh(clause)
        return clause