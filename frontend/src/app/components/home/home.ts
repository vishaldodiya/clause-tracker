import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavBar } from "./navbar/navbar";

@Component({
    selector: 'home',
    templateUrl: './home.html',
    imports: [NavBar, RouterOutlet]
})
export class Home {

}