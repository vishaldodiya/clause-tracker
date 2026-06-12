export interface Tag {
    id: string
    name: string
    created_at: Date
}

export interface TagCreate {
    name: string
}