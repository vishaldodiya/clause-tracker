import { inject, Injectable, signal } from "@angular/core";
import { Contract, Progress } from "../models/contract.model";
import { ActivatedRoute } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class ContextService {
    private _contract = signal<Contract | null>(null)
    readonly contract = this._contract.asReadonly()

    setContract(contract: Contract | null) {
        this._contract.set(contract)
    }

    clearContract() {
        this._contract.set(null)
    }
}