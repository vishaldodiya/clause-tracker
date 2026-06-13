import { Component, computed, inject } from "@angular/core";
import { ContextService } from "../../../services/context.service";
import { ClauseService } from "../../../services/clause.service";
import { ProgressBar } from "../../progress-bar/progress-bar";
import { Router } from "@angular/router";

@Component({
    selector: 'nav-bar',
    templateUrl: './navbar.html',
    imports: [ProgressBar]
})
export class NavBar {
    private context = inject(ContextService)
    private clauseService = inject(ClauseService)
    private router = inject(Router)

    contract = this.context.contract

    heading = computed<string>(() => this.contract()?.name ?? 'Contract tracker')

    currentProgress = computed(() => {
        if (!this.contract()) return null
        return this.clauseService.currentProgress()
    })

    navigateToHome() {
        this.context.clearContract()
        this.router.navigate(['/'])
    }
}