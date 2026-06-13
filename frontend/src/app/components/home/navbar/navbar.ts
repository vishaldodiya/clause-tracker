import { Component, inject, signal } from "@angular/core";
import { ContextService } from "../../../services/context.service";

@Component({
    selector: 'nav-bar',
    templateUrl: './navbar.html'
})
export class NavBar {
    private context = inject(ContextService)

    contract = this.context.contract

    heading = signal<string>(this.contract()?.name || 'Contract Tracker')
}