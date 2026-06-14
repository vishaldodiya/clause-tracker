from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from schemas.pydantic_models import ContractCreate
from schemas.orm_models import ContractModel, ContractTagModel

class ContractMutations:
    @staticmethod
    def create_contract(db: Session, contract_data: ContractCreate) -> ContractModel:
        contract = ContractModel(
            id=uuid4(),
            name=contract_data.name,
        )
        db.add(contract)
        db.flush()
        db.refresh(contract)
        return contract

    @staticmethod
    def update_contract(db: Session, contract_id: UUID, contract_data: ContractCreate) -> ContractModel:
        contract = ContractModel(
            id=contract_id,
            name=contract_data.name,
        )
        merged = db.merge(contract)
        db.flush()
        db.refresh(merged)
        return merged
