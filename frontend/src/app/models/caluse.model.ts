export interface Clause {
    id: string
    content: string
    paragraph_id: number
    sentence_id: number
    label_id: string
    created_at: Date
    updated_at: Date
}

export interface Paragraph {
    paragraph_number: number
    clauses: Clause[]
}