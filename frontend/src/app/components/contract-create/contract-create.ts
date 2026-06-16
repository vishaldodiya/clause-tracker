import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { MultiSelect, SelectableItem } from "../multi-select/multi-select";
import { ContractService } from "../../services/contract.service";
import { TagService } from "../../services/tag.service";

const ALLOWED_EXTENSIONS = ['txt', 'md'];

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
    fileError = signal<string | null>(null)
    tags = this.tagService.tags

    tagOptionList = computed<SelectableItem[]>(() => {
        return this.tags().map((tag) => ({ id: tag.id, name: tag.name }))
    })

    contractForm = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(100)]],
        tags: [[] as SelectableItem[]]
    })

    get nameCtrl() { return this.contractForm.get('name')! }

    isFormValid() {
        return this.contractForm.valid && this.selectedFile() !== null && this.fileError() === null
    }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement
        const file = input.files?.[0] ?? null

        if (!file) {
            this.selectedFile.set(null)
            this.fileError.set('File is required')
            return
        }

        const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            this.selectedFile.set(null)
            this.fileError.set('Only .txt and .md files are supported')
            return
        }

        this.selectedFile.set(file)
        this.fileError.set(null)
    }

    onSubmit(event: MouseEvent) {
        event.preventDefault()
        // Force all form field into touched state
        this.contractForm.markAllAsTouched()

        const file = this.selectedFile()
        if (!file) this.fileError.set('File is required')

        if (!this.isFormValid()) return

        this.contractService.createContract(this.contractForm, file!).subscribe({
            next: () => this.closeDialog(),
            error: (error) => console.error(error)
        })
    }

    openDialog() { this.isOpen.set(true) }

    closeDialog() { this.isOpen.set(false) }

    onTagCreate(name: string) {
        this.tagService.createTag({ name }).subscribe({
            next: (tag) => console.log(tag),
            error: (error) => console.log(error)
        })
    }

    ngOnInit() {
        this.tagService.getTags().subscribe({
            next: (tags) => console.log(tags),
            error: (error) => console.log(error)
        })
    }
}