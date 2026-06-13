import { inject, Injectable, signal } from "@angular/core";
import { ContractProgress } from "../models/contract.model";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProgressService {
    private _progress = signal<ContractProgress[]>([])
    readonly progress = this._progress.asReadonly()
    private http = inject(HttpClient)
    private baseUrl = 'http://localhost:8000/api/v1/progress'

    getContractProgress() {
        return this.http.get<ContractProgress[]>(this.baseUrl).pipe(
            tap((results: ContractProgress[]) => {
                this._progress.set(results)
            })
        )
    }
}