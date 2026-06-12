import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Tag } from "../models/tag.model";

@Injectable({
    providedIn: 'root'
})
export class TagService {
    private http = inject(HttpClient)
    private baseUrl = 'http://localhost:8000/api/v1'

    getTags(): Observable<Tag[]> {
        return this.http.get<Tag[]>(`${this.baseUrl}/tags`)
    }
}