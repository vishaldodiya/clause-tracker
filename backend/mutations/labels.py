
from schemas.pydantic_models import LabelCreate
from schemas.orm_models import LabelModel
from uuid import uuid4

class LabelMutations:
    @staticmethod
    def create_label(db, label_data: LabelCreate) -> LabelModel:
        new_label = LabelModel(id=uuid4(), name=label_data.name)
        db.add(new_label)
        db.commit()
        db.refresh(new_label)
        return new_label