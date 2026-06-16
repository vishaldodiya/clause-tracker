import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy_utils import database_exists, create_database
from contextlib import contextmanager
from schemas.orm_models import Base

database_url = os.getenv("DATABASE_URL")

if not database_exists(database_url):
    create_database(database_url)

engine = create_engine(database_url)
# re-usable session creator based on the engine
_SessionFactory = sessionmaker(bind=engine)

def init_db():
    # inspect all sqlalchemy base inherited models and create them if not exists.
    Base.metadata.create_all(engine)

@contextmanager
def transaction(db: Session):
    try:
        # let caller do the DB related work, 
        # once they are done successfully then execute next
        yield
        db.commit()
    except Exception as e:
        db.rollback()
        raise e

def get_db():
    db: Session = _SessionFactory()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
