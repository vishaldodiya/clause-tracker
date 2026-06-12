import { Component, signal } from "@angular/core";
import { Clause, Paragraph } from "../../models/caluse.model";
import { MultiSelect } from "../multi-select/multi-select";
import { DatePipe } from "@angular/common";
import { ɵInternalFormsSharedModule } from "@angular/forms";

@Component({
    selector: 'contract-editor',
    templateUrl: './contract-editor.html',
    imports: [MultiSelect, DatePipe, ɵInternalFormsSharedModule]
})
export class ContractEditor {
    clauses = signal<Paragraph[]>([
        {
            paragraph_number: 0,
            clauses: [
                {
                    id: '1',
                    content: 'This is the first clause.',
                    paragraph_id: 0,
                    sentence_id: 0,
                    label_id: '',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    id: '2',
                    content: 'This is the second clause.',
                    paragraph_id: 0,
                    sentence_id: 1,
                    label_id: 'label2',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ]
        },
        {
            paragraph_number: 1,
            clauses: [
                {
                    id: '3',
                    content: 'This is the third clause.',
                    paragraph_id: 1,
                    sentence_id: 0,
                    label_id: 'label3',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    id: '4',
                    content: 'This is the fourth clause.',
                    paragraph_id: 1,
                    sentence_id: 1,
                    label_id: 'label4',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ]
        }
    ])
    selectedClause = signal<Clause | null>(null)

    selectClause(clause: Clause) {
        this.selectedClause.set(clause)
    }

    onSubmit(event: MouseEvent) {
        event.preventDefault()

        console.log()
    }
}