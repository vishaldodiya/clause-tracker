import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { Label, LabelCreate } from "../models/label.model";

@Injectable({
    providedIn: 'root'
})
export class LabelService {
    private _labels = signal<Label[]>([])
    readonly labels = this._labels.asReadonly()
    private http = inject(HttpClient)
    private baseUrl = 'http://localhost:8000/api/v1/labels'

    getLabels(): Observable<Label[]> {
        return this.http.get<Label[]>(this.baseUrl).pipe(
            tap((labels: Label[]) => {
                this._labels.set(labels)
            })
        )
    }

    createLabel(labelCreate: LabelCreate): Observable<Label> {
        return this.http.post<Label>(this.baseUrl, labelCreate).pipe(
            tap((label: Label) => {
                this._labels.update((labels) => [...labels, label])
            })
        )
    }
}