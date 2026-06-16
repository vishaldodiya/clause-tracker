from sqlalchemy.orm import Session
from uuid import UUID
from schemas.orm_models import ContractModel

class ContractQueries:
    @staticmethod
    def get_contracts(db: Session) -> list[ContractModel]:
        return db.query(ContractModel).all()

    @staticmethod
    def get_contract_by_id(db: Session, contract_id: UUID) -> ContractModel | None:
        return db.query(ContractModel).where(ContractModel.id == contract_id).first()
