from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from controller.label import LabelController
from sqlalchemy.orm import Session
from controller.tag import TagController
from controller.contract import ContractController
from controller.clause import ClauseController
from controller.contract_progress import ContractProgressController
from schemas.pydantic_models import Clause, ClauseUpdate, Contract, ContractCreate, Tag, TagCreate, Label, LabelCreate, Paragraph, ContractProgress
from database import get_db, init_db
from uuid import UUID

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:80", "http://localhost"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/contracts", response_model=list[Contract])
# Dependency injection to keep db instance and closing clean
def get_contracts(db: Session = Depends(get_db)):
    return ContractController.get_contracts(db=db)

@app.get("/api/v1/contracts/{contract_id}", response_model=Contract)
def get_contract_by_id(contract_id: UUID, db: Session = Depends(get_db)):
    contract = ContractController.get_contract_by_id(db=db, contract_id=contract_id)
    if contract is None:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract

@app.post("/api/v1/contracts", response_model=Contract)
async def create_contract(
    file: UploadFile,
    contract_data: ContractCreate = Depends(ContractCreate.as_form),
    db: Session = Depends(get_db),
    ):
    return await ContractController.create_contract(db=db, contract_data=contract_data, file=file)

@app.put("/api/v1/contracts/{contract_id}", response_model=Contract)
def update_contract(contract_id: UUID, contract_data: ContractCreate = Depends(ContractCreate.as_form), db: Session = Depends(get_db)):
    return ContractController.update_contract(db=db, contract_id=contract_id, contract_data=contract_data)

@app.get("/api/v1/tags", response_model=list[Tag])
def get_tags(db: Session = Depends(get_db)):
    return TagController.get_tags(db=db)

@app.post("/api/v1/tags", response_model=Tag)
def create_tag(tag_data: TagCreate, db: Session = Depends(get_db)):
    print(tag_data)
    return TagController.create_tag(db=db, tag_data=tag_data)

@app.get("/api/v1/labels", response_model=list[Label])
def get_labels(db: Session = Depends(get_db)):
    return LabelController.get_labels(db=db)

@app.post("/api/v1/labels", response_model=Label)
def create_label(label_data: LabelCreate, db: Session = Depends(get_db)):
    return LabelController.create_label(db=db, label_data=label_data)

@app.get("/api/v1/clauses", response_model=list[Paragraph])
def get_clauses(contract_id: UUID | None = None, db: Session = Depends(get_db)):
    return ClauseController.get_clauses(db=db, contract_id=contract_id)

@app.get("/api/v1/progress", response_model=list[ContractProgress])
def get_progress(db: Session = Depends(get_db)):
    return ContractProgressController.get_all_contract_progress(db=db)

@app.put("/api/v1/clauses/{clause_id}", response_model=Clause)
def update_clause(clause_id: UUID, clause_data: ClauseUpdate, db: Session = Depends(get_db)):
    return ClauseController.update_clause(db=db, clause_id=clause_id, clause_data=clause_data)