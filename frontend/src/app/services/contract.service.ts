import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Contract } from "../models/contract.model";
import { Observable, tap } from "rxjs";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class ContractService {
    private _contracts = signal<Contract[]>([])
    readonly contracts = this._contracts.asReadonly()
    private http = inject(HttpClient)
    private baseUrl = 'http://localhost:8000/api/v1/contracts'

    getContracts(): Observable<Contract[]> {
        return this.http.get<Contract[]>(`${this.baseUrl}`).pipe(
            tap(contracts => this._contracts.set(contracts))
        )
    }

    createContract(form: FormGroup, file: File): Observable<Contract> {
        const formData = new FormData()

        Object.entries(form.value).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                (value as any[]).forEach(item =>
                    formData.append(key, typeof item === 'object' ? item.id : item)
                )
            } else if (value !== null && value !== undefined) {
                formData.append(key, value as string)
            }
        })

        formData.append('file', file)
        return this.http.post<Contract>(`${this.baseUrl}`, formData).pipe(
            tap((contract: Contract) => {
                this._contracts.update((contracts) => [...contracts, contract])
            })
        )
    }
}