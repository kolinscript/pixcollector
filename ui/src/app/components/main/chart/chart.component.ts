import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  public users: any;

  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getPublicUsers().subscribe((users) => {
      if (users.body.users) {
        this.users = users.body.users;
      }
    });
  }

  public goToStock(vkId: number): void {
    this.router.navigate([`/stock/${vkId}`]);
  }

}
