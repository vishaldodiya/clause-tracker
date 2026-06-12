import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { MultiSelect } from "../multi-select/multi-select";
import { ContractService } from "../../services/contract.service";

@Component({
    selector: 'contract-create',
    templateUrl: './contract-create.html',
    imports: [MultiSelect, ReactiveFormsModule]
})
export class ContractCreate {
    private contractService = inject(ContractService)
    private fb = inject(FormBuilder)

    isOpen = signal<boolean>(false)
    selectedFile = signal<File | null>(null)

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
}