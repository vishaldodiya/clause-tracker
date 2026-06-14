import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy_utils import database_exists, create_database
from contextlib import contextmanager
from schemas.orm_models import Base

database_url = os.getenv("DATABASE_URL")

def get_engine():
    if not database_exists(database_url):
        create_database(database_url)

    return create_engine(database_url)

def get_session():
    engine = get_engine()
    session = sessionmaker(bind=engine)
    return session

def init_db():
    engine = get_engine()
    Base.metadata.create_all(engine)

@contextmanager
def transaction(db: Session):
    try:
        yield
        db.commit()
    except Exception as e:
        db.rollback()
        raise e

def get_db():
    db: Session = get_session()()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

init_db()
