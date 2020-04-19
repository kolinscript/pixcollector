import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  windowWidth: number;


  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    console.log(this.router.url);
  }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
  }

  public onResize(event): void {
    this.windowWidth = event.target.innerWidth;
  }

}
