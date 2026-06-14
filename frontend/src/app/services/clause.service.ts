import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { Clause, Paragraph } from "../models/clause.model";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ClauseService {
    private _clauses = signal<Paragraph[]>([])
    readonly clauses = this._clauses.asReadonly()
    readonly currentProgress = computed(() => {
        const all = this._clauses().flatMap(p => p.clauses)
        return { total: all.length, labelled: all.filter(c => c.label_id).length }
    })
    private http = inject(HttpClient)
    private baseUrl = `${environment.apiUrl}/api/v1/clauses`

    getClauses(id: string): Observable<Paragraph[]> {
        return this.http.get<Paragraph[]>(`${this.baseUrl}?contract_id=${id}`).pipe(
            tap((clauses: Paragraph[]) => {
                this._clauses.set(clauses)
            })
        )
    }

    updateClause(clause: Clause): Observable<Clause> {
        return this.http.put<Clause>(`${this.baseUrl}/${clause.id}`, { label_id: clause.label_id }).pipe(
            tap((newClause: Clause) => {
                this._clauses.update((paragraphs) => {
                    const paragraph = paragraphs[clause.paragraph_number]
                    paragraph.clauses[clause.sentence_number] = newClause
                    return [...paragraphs]
                })
            })
        )
    }
}