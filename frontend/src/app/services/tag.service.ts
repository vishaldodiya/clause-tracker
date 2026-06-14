import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { Tag, TagCreate } from "../models/tag.model";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class TagService {
    private _tags = signal<Tag[]>([])
    readonly tags = this._tags.asReadonly()
    private http = inject(HttpClient)
    private baseUrl = `${environment.apiUrl}/api/v1/tags`

    getTags(): Observable<Tag[]> {
        return this.http.get<Tag[]>(this.baseUrl).pipe(
            tap((tags: Tag[]) => {
                this._tags.set(tags)
            })
        )
    }

    createTag(tagCreate: TagCreate): Observable<Tag> {
        return this.http.post<Tag>(this.baseUrl, tagCreate).pipe(
            tap((tag: Tag) => {
                this._tags.update((tags) => [...tags, tag])
            })
        )
    }
}