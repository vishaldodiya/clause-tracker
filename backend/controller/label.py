
from sqlalchemy.orm import Session
from mutations.labels import LabelMutations
from queries.labels import LabelQueries
from mutations.labels import LabelMutations
from schemas.contract import Label
from schemas.contract import LabelCreate

class LabelController:
    @staticmethod
    def get_labels(db: Session) -> list[Label]:
        return LabelQueries.get_all_labels(db)
    
    @staticmethod
    def create_label(db: Session, label_data: LabelCreate) -> Label:
        return LabelMutations.create_label(db, label_data=label_data)