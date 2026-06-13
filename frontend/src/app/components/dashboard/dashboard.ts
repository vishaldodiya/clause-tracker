import { Component } from "@angular/core";
import { ContractList } from "../contract-list/contract-list";
import { ContractCreate } from "../contract-create/contract-create";

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.html',
    imports: [ContractCreate, ContractList]
})
export class Dashboard {

}