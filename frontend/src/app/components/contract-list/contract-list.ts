import { Component, inject, signal } from "@angular/core";
import { ContractService } from "../../services/contract.service";
import { Contract } from "../../models/contract.model";

@Component({
    selector: 'contract-list',
    templateUrl: './contract-list.html'
})
export class ContractList {
    private contractService = inject(ContractService)

    isLoading = signal<boolean>(false)
    contracts = signal<Contract[]>([])

    ngOnInit() {
        this.loadContracts()
    }

    loadContracts() {
        this.isLoading.set(true)
        this.contractService.getContracts().subscribe({
            next: (data) => {
                this.contracts.set(data)
                this.isLoading.set(false)
            },
            error: (error) => {
                console.error(error)
                this.isLoading.set(false)
            },
            complete: () => {
                console.log("data loading completes")
            }
        })
    }
}