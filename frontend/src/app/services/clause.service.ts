import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Clause } from "../models/caluse.mode";

@Injectable({
    providedIn: 'root'
})
export class ClauseService {
    private http = inject(HttpClient)
    private baseUrl = 'http://localhost:8000/api/v1'

    getClauses(): Observable<Clause[]> {
        return this.http.get<Clause[]>(`${this.baseUrl}/clauses`)
    }
}