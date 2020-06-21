import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';
import { Router } from '@angular/router';
import { SideBarService } from '../../../../../services/side-bar.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public form: FormGroup;
  public href: string;
  public user;

  constructor(
    private authService: AuthService,
    private sideBar: SideBarService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const authorized = this.authService.isAuthorized();
    if (authorized) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.href = `https://vk.com/id${this.user.vkId}`;
    }
    this.initForm();
    console.log(this.form.value);
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth']);
    this.sideBar.closeSideAllBars();
  }

  private initForm(): void {
    this.form = this.fb.group({
      privacy: null
    });
    this.form.get('privacy').valueChanges.subscribe((privacy) => {
      console.log(privacy);
    });
  }

}
