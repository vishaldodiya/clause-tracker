import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ContractList } from "../contract-list/contract-list";

@Component({
    selector: 'home',
    templateUrl: './home.html',
    imports: [ContractList]
})
export class Home {

}