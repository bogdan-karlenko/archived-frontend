import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AuthService as SocialAuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angular-6-social-login';
import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\d\w])/)]);
  hide = true;

  constructor(
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() { }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.authService.authenticateSocial(userData)
          .subscribe(data => {
            if (data.user && data.token) {
              this.authService.setAuthInfo(data);
              this.router.navigate(['/workspace']);
            }
          });
      });
  }

  onSubmit() {
    if (!this.email.invalid && !this.password.invalid) {
      this.authService.authenticateLocal({ email: this.email.value, password: this.password.value })
        .subscribe(data => {
          if (data.user && data.token) {
            this.authService.setAuthInfo(data);
            this.router.navigate(['/workspace']);
          }
        });
    }
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }
  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'You must enter a value' :
      this.password.hasError('minlength') ? 'Password must contain at least 8 characters' :
        this.password.hasError('pattern') ? 'Use at least one letter, one number and one special character' :
          '';
  }
}
