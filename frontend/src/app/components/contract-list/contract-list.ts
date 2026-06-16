import { Component, computed, inject, model, signal } from "@angular/core";
import { ContractService } from "../../services/contract.service";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { ProgressService } from "../../services/progress.service";
import { Contract, ContractProgress } from "../../models/contract.model";
import { ProgressBar } from "../progress-bar/progress-bar";
import { MultiSelect, SelectableItem } from "../multi-select/multi-select";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, debounceTime, distinctUntilChanged, forkJoin, map, of } from "rxjs";
import { Loading } from "../loading/loading";

@Component({
    selector: 'contract-list',
    templateUrl: './contract-list.html',
    imports: [DatePipe, ProgressBar, MultiSelect, ReactiveFormsModule, Loading]
})
export class ContractList {
    private contractService = inject(ContractService)
    private progressService = inject(ProgressService)
    private router = inject(Router)
    private fb = inject(FormBuilder)

    filterForm = this.fb.group({
        search: [''],
        tags: [[] as SelectableItem[]]
    })

    query = toSignal(this.filterForm.get('search')!.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
    ), { initialValue: '' })

    tags = toSignal(this.filterForm.get('tags')!.valueChanges.pipe(
        debounceTime(300),
        map((tags: SelectableItem[] | null) => tags?.map((tag) => tag.id) ?? []),
        distinctUntilChanged()
    ), { initialValue: [] as string[] })

    isLoading = signal<boolean>(false)

    contracts = this.contractService.contracts
    progress = this.progressService.progress

    filteredContracts = computed(() => {
        const query = this.query() ?? ''
        return this.contracts().filter((c) => {
            const selectedTagIds = this.tags()
            const contractTagIds = c.tags.map(t => t.id)

            const hasAllTags = selectedTagIds.length === 0 || selectedTagIds.every(id => contractTagIds.includes(id))

            return c.name.toLowerCase().includes(query.toLowerCase()) && hasAllTags
        })
    })
    tagSelctableItems = computed<SelectableItem[]>(() => {
        const map = new Map<string, string>()
        this.contracts().forEach((contract) => {
            contract.tags.forEach((tag) => {
                if (!map.has(tag.id)) {
                    map.set(tag.id, tag.name)
                }
            })
        })
        return Array.from(map.entries()).map(([key, value]) => ({ id: key, name: value }))
    })

    progressMap = computed(() => {
        const map = new Map<string, ContractProgress>()

        this.progress().forEach((p) => {
            map.set(p.contract_id, p)
        })

        return map
    })

    ngOnInit() {
        this.isLoading.set(true)
        forkJoin({
            progress: this.progressService.getContractProgress().pipe(catchError(() => of(null))),
            contracts: this.contractService.getContracts().pipe(catchError(() => of(null)))
        }).subscribe(() => {
            this.isLoading.set(false)
        })
    }

    openContract(contract: Contract) {
        this.router.navigate([`/contracts/${contract.id}`])
    }

    onReset() {
        this.filterForm.reset()
    }
}