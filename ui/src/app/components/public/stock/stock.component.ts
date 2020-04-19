import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  public id;
  public user;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.id = this.router.url.slice(7);
    console.log(this.id);
    this.userService.getUser(this.id).subscribe((user) => {
      if (!user.body.user) {
      } else if (user.body.user) {
        const safeUser = ({ token, pixArray, ...rest }) => rest;
        this.user = user.body.user;
        if (localStorage.getItem('token')) {
          localStorage.setItem('token', user.body.user.token);
          localStorage.setItem('user', JSON.stringify(safeUser(user.body.user)));
        }
      }
    });
    //   console.log(response);
    //   if (!response.data.body.user) {
    //     // window.location = 'https://pixcollector.herokuapp.com/auth'; // redirect to AUTH
    //   } else if (response.data.body.user) {
    //     console.log(response.data);
    //     this.setState({user: response.data.body.user});
    //   }
    // })
  }

}
