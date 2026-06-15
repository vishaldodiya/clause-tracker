export interface Clause {
    id: string
    content: string
    contract_id: string,
    paragraph_number: number
    sentence_number: number
    label_id: string | null
    created_at: Date
    updated_at: Date
}

export interface Paragraph {
    paragraph_number: number
    clauses: Clause[]
}