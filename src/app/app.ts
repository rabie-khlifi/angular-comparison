import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  // This selector matches <app-root> in index.html, making this the root host element.
  selector: 'app-root',
  // A standalone component declares its own template dependencies here.
  // An NgModule-declared component receives them through its NgModule instead.
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
