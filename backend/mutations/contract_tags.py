from uuid import UUID, uuid4

from models import ContractTagModel

class ContractTagsMutations:
    @staticmethod
    def add_tags_to_contract(db, contract_id: str, tag_ids: list[UUID]):
        pair_list: list[ContractTagModel] = []
        for tag_id in tag_ids:
            pair_list.append(ContractTagModel(id=uuid4(), contract_id=contract_id, tag_id=tag_id))

        db.add_all(pair_list)