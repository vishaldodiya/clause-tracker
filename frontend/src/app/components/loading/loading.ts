import { Component } from "@angular/core";

@Component({
    standalone: true,
    selector: 'loading',
    templateUrl: './loading.html',
    host: {
        class: 'flex w-full h-full bg-[#ebe6db] animate-pulse rounded-md'
    }
})
export class Loading {

}