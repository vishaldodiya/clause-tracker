import { Component, inject, signal } from "@angular/core";
import { ContractService } from "../../services/contract.service";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";

@Component({
    selector: 'contract-list',
    templateUrl: './contract-list.html',
    imports: [DatePipe]
})
export class ContractList {
    private contractService = inject(ContractService)
    private router = inject(Router)

    isLoading = signal<boolean>(false)
    contracts = this.contractService.contracts

    ngOnInit() {
        this.loadContracts()
    }

    loadContracts() {
        this.isLoading.set(true)
        this.contractService.getContracts().subscribe({
            next: () => this.isLoading.set(false),
            error: (error) => {
                console.error(error)
                this.isLoading.set(false)
            }
        })
    }

    openContract(id: string) {
        this.router.navigate([`/contracts/${id}`])
    }
}