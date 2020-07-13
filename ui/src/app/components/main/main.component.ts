import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SideBarService } from '../../services/side-bar.service';
import { ShadowInOut } from '../../animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [ShadowInOut.animationTrigger]
})
export class MainComponent implements OnInit {
  windowWidth: number;

  constructor() {}

  ngOnInit() {
    this.windowWidth = window.innerWidth;
  }

  public onResize(event): void {
    this.windowWidth = event.target.innerWidth;
  }

}
