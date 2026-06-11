from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from controller.contract import ContractController
from schemas.contract import Contract, ContractCreate
from database import get_db

app = FastAPI()

@app.get("/api/v1/contracts", response_model=list[Contract])
def get_contracts(db: Session = Depends(get_db)):
    return ContractController.get_contracts(db=db)

@app.get("/api/v1/contracts/{contract_id}", response_model=Contract)
def get_contract_by_id(contract_id: str, db: Session = Depends(get_db)):
    contract = ContractController.get_contract_by_id(db=db, contract_id=contract_id)
    if contract is None:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract

@app.post("/api/v1/contracts", response_model=Contract)
def create_contract(contract_data: ContractCreate, db: Session = Depends(get_db)):
    return ContractController.create_contract(db=db, contract_data=contract_data)
