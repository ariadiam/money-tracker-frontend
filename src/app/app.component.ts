import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  name = 'Money Tracker';

  person = {
    firstname: 'Aria',
    lastname: 'Diamanti',
    age: 24,
    email: 'aria@gmail.com'
  }
}
