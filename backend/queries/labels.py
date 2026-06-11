
from models import LabelModel

class LabelQueries:
    @staticmethod
    def get_all_labels(db) -> list[LabelModel]:
        return db.query(LabelModel).all()