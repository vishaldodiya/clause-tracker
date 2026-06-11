from sqlalchemy.orm import Session
from uuid import UUID
from mutations.contract import ContractMutations
from queries.contract import ContractQueries
from schemas.contract import Contract, ContractCreate

class ContractController:
    @staticmethod
    def create_contract(db: Session, contract_data: ContractCreate) -> Contract:
        return ContractMutations.create_contract(db=db, contract_data=contract_data)

    @staticmethod
    def get_contracts(db: Session, limit: int = 10, offset: int = 0) -> list[Contract]:
        return ContractQueries.get_contracts(db=db, limit=limit, offset=offset)

    @staticmethod
    def get_contract_by_id(db: Session, contract_id: UUID) -> Contract | None:
        return ContractQueries.get_contract_by_id(db=db, contract_id=contract_id)

    @staticmethod
    def update_contract(db: Session, contract_id: UUID, contract_data: ContractCreate) -> Contract:
        return ContractMutations.update_contract(db=db, contract_id=contract_id, contract_data=contract_data)
