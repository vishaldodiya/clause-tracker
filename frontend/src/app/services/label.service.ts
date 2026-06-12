import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Label } from "../models/label.model";

@Injectable({
    providedIn: 'root'
})
export class LabelService {
    private http = inject(HttpClient)
    private baseUrl = 'http://localhost:8000/api/v1'

    getLabels(): Observable<Label[]> {
        return this.http.get<Label[]>(`${this.baseUrl}/labels`)
    }
}