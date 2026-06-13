import { Component, computed, inject, signal } from "@angular/core";
import { Clause, Paragraph } from "../../models/caluse.model";
import { MultiSelect, SelectableItem } from "../multi-select/multi-select";
import { DatePipe } from "@angular/common";
import { FormBuilder, ɵInternalFormsSharedModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ClauseService } from "../../services/clause.service";
import { LabelService } from "../../services/label.service";
import { Label } from "../../models/label.model";

@Component({
    selector: 'contract-editor',
    templateUrl: './contract-editor.html',
    imports: [MultiSelect, DatePipe, ɵInternalFormsSharedModule, ReactiveFormsModule]
})
export class ContractEditor {
    private labelService = inject(LabelService)
    private activatedRoute = inject(ActivatedRoute)
    private clauseService = inject(ClauseService)
    private fb = inject(FormBuilder)

    selectedClause = signal<Clause | null>(null)

    clauses = this.clauseService.clauses
    labels = this.labelService.labels

    clauseForm = this.fb.group({
        labels: [[] as Label[]]
    })

    labelOptionList = computed<SelectableItem[]>(() => {
        return this.labels().map((label) => ({ id: label.id, name: label.name }))
    })

    selectClause(clause: Clause) {
        this.selectedClause.set(clause)
        const selectedLabel = this.labels().find((label) => label.id === clause.label_id)
        this.clauseForm.patchValue({ labels: selectedLabel ? [selectedLabel] : [] })
    }

    onSubmit(event: MouseEvent) {
        event.preventDefault()

        const selectedClause = this.selectedClause()
        const labels = this.clauseForm.value.labels
        const label = Array.isArray(labels) ? labels[0] : null

        if (!selectedClause) {
            return
        }

        this.clauseService.updateClause({
            ...selectedClause,
            label_id: label && label.id
        }).subscribe({
            next: (clause: Clause) => {
                console.log(clause)
            },
            error: (error) => {
                console.log(error)
            }
        })
    }

    createLabel(name: string) {
        this.labelService.createLabel({ name }).subscribe({
            next: (label) => {
                console.log(label)
            },
            error: (error) => {
                console.log(error)
            }
        })
    }

    ngOnInit() {
        const contractId = this.activatedRoute.snapshot.paramMap.get('id') ?? ''
        this.clauseService.getClauses(contractId).subscribe({
            next: (clauses) => {
                console.log(clauses)
            },
            error: (error) => {
                console.log(error)
            }
        })
        this.labelService.getLabels().subscribe({
            next: (labels) => {
                console.log(labels)
            },
            error: (error) => {
                console.log(error)
            }
        })
    }
}