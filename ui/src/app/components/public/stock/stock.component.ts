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
      if (!user.data.body.user) {
      } else if (user.data.body.user) {
        localStorage.setItem('token', user.data.body.user.token);
        const safeUser = ({ token, pixArray, ...rest }) => rest;
        localStorage.setItem('user', JSON.stringify(safeUser(user.data.body.user)));
        this.user = user.data.body.user;
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
