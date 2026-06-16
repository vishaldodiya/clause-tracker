import { Component, computed, inject, signal } from "@angular/core";
import { Clause, Paragraph } from "../../models/clause.model";
import { MultiSelect, SelectableItem } from "../multi-select/multi-select";
import { DatePipe } from "@angular/common";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ClauseService } from "../../services/clause.service";
import { LabelService } from "../../services/label.service";
import { Label } from "../../models/label.model";
import { ContractService } from "../../services/contract.service";
import { ContextService } from "../../services/context.service";
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Loading } from "../loading/loading";

@Component({
    selector: 'contract-editor',
    templateUrl: './contract-editor.html',
    imports: [MultiSelect, DatePipe, ReactiveFormsModule, Loading]
})
export class ContractEditor {
    private labelService = inject(LabelService)
    private activatedRoute = inject(ActivatedRoute)
    private clauseService = inject(ClauseService)
    private contractService = inject(ContractService)
    private context = inject(ContextService)
    private fb = inject(FormBuilder)

    selectedClause = signal<Clause | null>(null)
    isLoading = signal<boolean>(false)
    selectedFilterLabel = signal<string | null>(null)

    clauses = this.clauseService.clauses
    labels = this.labelService.labels

    clauseForm = this.fb.group({
        labels: [[] as Label[]]
    })

    labelOptionList = computed<SelectableItem[]>(() => {
        return this.labels().map((label) => ({ id: label.id, name: label.name }))
    })

    usedLabelsWithCounts = computed(() => {
        const labelNameMap = new Map(this.labels().map(l => [l.id, l.name]))
        const countMap = new Map<string, { id: string; name: string; count: number }>()
        for (const clause of this.clauses().flatMap(p => p.clauses)) {
            if (!clause.label_id) continue
            const entry = countMap.get(clause.label_id)
            if (entry) entry.count++
            else countMap.set(clause.label_id, { id: clause.label_id, name: labelNameMap.get(clause.label_id) ?? clause.label_id, count: 1 })
        }
        return Array.from(countMap.values())
    })

    toggleFilterLabel(labelId: string) {
        this.selectedFilterLabel.update(current => current === labelId ? null : labelId)
    }

    selectClause(clause: Clause) {
        this.selectedClause.set(clause)
        const selectedLabel = this.labels().find((label) => label.id === clause.label_id)
        // To override form key value
        this.clauseForm.patchValue({ labels: selectedLabel ? [selectedLabel] : [] })
    }

    onSubmit(event: MouseEvent) {
        event.preventDefault()

        const selectedClause = this.selectedClause()
        const labels = this.clauseForm.value.labels
        const label = Array.isArray(labels) && labels[0] ? labels[0] : null

        if (!selectedClause) {
            return
        }

        this.clauseService.updateClause({
            ...selectedClause,
            label_id: label && label.id
        }).subscribe({
            next: (clause: Clause) => {
                this.selectedClause.set(clause)
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
        const requireContractData = this.context.contract()?.id !== contractId

        this.isLoading.set(true)
        forkJoin({
            clauses: this.clauseService.getClauses(contractId).pipe(catchError(() => of(null))),
            labels: this.labelService.getLabels().pipe(catchError(() => of(null))),
            contract: requireContractData ? this.contractService.getContract(contractId).pipe(catchError(() => of(null))) : of(null)
        }).subscribe(({ contract }) => {
            if (contract) this.context.setContract(contract)
            this.isLoading.set(false)
        })
    }
}