from sqlalchemy.orm import Session
from uuid import UUID
from mutations.contracts import ContractMutations
from mutations.clauses import ClauseMutations
from mutations.contract_tags import ContractTagsMutations
from queries.contracts import ContractQueries
from schemas.pydantic_models import Contract, ContractCreate
from fastapi import UploadFile
from parsers.file_parser import FileParser
from database import transaction

class ContractController:
    @staticmethod
    async def create_contract(db: Session, contract_data: ContractCreate, file: UploadFile) -> Contract:
        with transaction(db):
            file_content = await FileParser.parse_file(file)
            contract = ContractMutations.create_contract(db=db, contract_data=contract_data)
            ContractTagsMutations.add_tags_to_contract(db=db, contract_id=contract.id, tag_ids=contract_data.tags)
            ClauseMutations.create_clauses(db, contract_id=contract.id, content=file_content)
            return contract

    @staticmethod
    def get_contracts(db: Session, limit: int = 10, offset: int = 0) -> list[Contract]:
        return ContractQueries.get_contracts(db=db, limit=limit, offset=offset)

    @staticmethod
    def get_contract_by_id(db: Session, contract_id: UUID) -> Contract | None:
        return ContractQueries.get_contract_by_id(db=db, contract_id=contract_id)

    @staticmethod
    def update_contract(db: Session, contract_id: UUID, contract_data: ContractCreate) -> Contract:
        with transaction(db):
            contract = ContractMutations.update_contract(db=db, contract_id=contract_id, contract_data=contract_data)
            ContractTagsMutations.add_tags_to_contract(db=db, contract_id=contract.id, tag_ids=contract_data.tags)
            return contract
