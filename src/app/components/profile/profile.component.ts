import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ResponseModel } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  myUser: any;

  constructor(
    private authService: SocialAuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.userData$
      .pipe(
        map(user => {
          if (user instanceof SocialUser) {
            return {
              ...user,
              email: 'test@test.com'
            };
          } else {
            return user;
          }
        })
      ).subscribe((data: ResponseModel | SocialUser) => {
        this.myUser = data;
      });
  }

  logout() {
    this.userService.logout();
  }
}
