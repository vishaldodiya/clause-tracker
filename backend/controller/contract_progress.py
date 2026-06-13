from collections import defaultdict
from database import Session
from queries.clauses import ClauseQueries
from schemas.contract import Progress, ContractProgress
from uuid import UUID

class ContractProgressController:
    @staticmethod
    def get_all_contract_progress(db: Session) -> list[ContractProgress]:
        clauses = ClauseQueries.get_all_clauses(db)
        grouped: dict[UUID, Progress] = defaultdict(lambda: Progress(total=0, labelled=0))

        for clause in clauses:
            grouped[clause.contract_id].total += 1
            if clause.label_id:
                grouped[clause.contract_id].labelled += 1

        return [
            ContractProgress(contract_id=contract_id, progress=progress) for contract_id, progress in grouped.items()
        ]