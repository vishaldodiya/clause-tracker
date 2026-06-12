import { Component, signal } from '@angular/core';
import { Home } from './components/home/home';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('clause-tracker');
}
