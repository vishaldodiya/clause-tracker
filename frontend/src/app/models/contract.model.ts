import { Tag } from "./tag.model"

export interface Contract {
    id: string
    name: string
    created_at: Date
    updated_at: Date
    tags: Tag[]
}

export interface Progress {
    total: number
    labelled: number
}

export interface ContractProgress {
    contract_id: string
    progress: Progress
}