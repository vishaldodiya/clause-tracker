import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ContractList } from "../contract-list/contract-list";
import { ContractCreate } from "../contract-create/contract-create";

@Component({
    selector: 'home',
    templateUrl: './home.html',
    imports: [ContractList, ContractCreate]
})
export class Home {

}