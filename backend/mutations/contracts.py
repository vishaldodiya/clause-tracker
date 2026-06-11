from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from schemas.contract import ContractCreate
from models import ContractModel, ContractTagModel

class ContractMutations:
    @staticmethod
    def create_contract(db: Session, contract_data: ContractCreate) -> ContractModel:
        contract = ContractModel(
            id=uuid4(),
            name=contract_data.name,
        )
        db.add(contract)
        for tag_id in contract_data.tags:
            db.add_all([
                ContractTagModel(
                    id=uuid4(),
                    contract_id=contract.id,
                    tag_id=tag_id,
                )
            ])
        db.commit()
        db.refresh(contract)
        return contract

    @staticmethod
    def update_contract(db: Session, contract_id: UUID, contract_data: ContractCreate) -> ContractModel:
        contract = ContractModel(
            id=contract_id,
            name=contract_data.name,
        )
        db.merge(contract)
        db.commit()
        db.refresh(contract)
        return contract
