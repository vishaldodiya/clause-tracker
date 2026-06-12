import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Paragraph } from "../models/caluse.model";

@Injectable({
    providedIn: 'root'
})
export class ClauseService {
    private http = inject(HttpClient)
    private baseUrl = 'http://localhost:8000/api/v1'

    getClauses(): Observable<Paragraph[]> {
        return this.http.get<Paragraph[]>(`${this.baseUrl}/clauses`)
    }
}