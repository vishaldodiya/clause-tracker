import { Component, computed, inject, input, Pipe, PipeTransform } from "@angular/core";
import { ProgressService } from "../../services/progress.service";
import { RepeatPipe } from "../../pipes/repeat-pipe";
import { Progress } from "../../models/contract.model";

@Component({
    selector: 'progress-bar',
    templateUrl: './progress-bar.html',
    imports: [
        RepeatPipe
    ]
})
export class ProgressBar {
    progress = input<Progress>()

    progressFraction = computed(() => {
        return Math.floor((this.progress()?.labelled ?? 0) / (this.progress()?.total ?? 1) * 10)
    })
}