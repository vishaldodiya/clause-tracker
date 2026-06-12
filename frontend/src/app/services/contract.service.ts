import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Contract } from "../models/contract.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ContractService {
    private http = inject(HttpClient)
    private baseUrl = 'http://localhost:8000/api/v1'

    getContracts(): Observable<Contract[]> {
        return this.http.get<Contract[]>(`${this.baseUrl}/contracts`)
    }
}