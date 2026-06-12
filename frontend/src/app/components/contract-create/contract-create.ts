import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { MultiSelect, SelectableItem } from "../multi-select/multi-select";
import { ContractService } from "../../services/contract.service";
import { TagService } from "../../services/tag.service";

@Component({
    selector: 'contract-create',
    templateUrl: './contract-create.html',
    imports: [MultiSelect, ReactiveFormsModule]
})
export class ContractCreate {
    private contractService = inject(ContractService)
    private tagService = inject(TagService)
    private fb = inject(FormBuilder)

    isOpen = signal<boolean>(false)
    selectedFile = signal<File | null>(null)
    tags = this.tagService.tags

    tagOptionList = computed<SelectableItem[]>(() => {
        return this.tags().map((tag) => ({
            id: tag.id,
            name: tag.name
        }))
    })

    contractForm = this.fb.group({
        name: ['', Validators.required],
        tags: [[]]
    })

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement
        const file = input.files?.[0] ?? null
        this.selectedFile.set(file)
    }

    onSubmit(event: MouseEvent) {
        event.preventDefault()
        const file = this.selectedFile()
        if (!file) return
        this.contractService.createContract(this.contractForm, file).subscribe({
            next: () => this.closeDialog(),
            error: (error) => console.error(error)
        })
    }

    openDialog() {
        this.isOpen.set(true)
    }

    closeDialog() {
        this.isOpen.set(false)
    }

    onTagCreate(name: string) {
        this.tagService.createTag({name}).subscribe({
            next: (tag) => {
                console.log(tag)
            },
            error: (error) => {
                console.log(error)
            }
        })
    }

    ngOnInit() {
        this.tagService.getTags().subscribe({
            next: (tags) => {
                console.log(tags)
            },
            error: (error) => {
                console.log(error)
            }
        })
    }
}