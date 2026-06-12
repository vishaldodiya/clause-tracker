import { Tag } from "./tag.model"

export interface Contract {
    id: string
    created_at: Date
    updated_at: Date
    tags: Tag[]
}