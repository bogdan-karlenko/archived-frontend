import { AuthService as SocialAuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angular-6-social-login';
import { AuthService } from './../services/auth.service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { RegisterService } from './../services/register.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registrationForm = this.formBuilder.group({
    email: [''],
    password: ['', [Validators.minLength(8), Validators.pattern(/(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\d\w])/)]],
    confirmPassword: [''],
    facebook: [''],
    google: ['']
  }, { validator: this.checkPasswords });

  code = '';

  matcher = new MyErrorStateMatcher();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private registerService: RegisterService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService,
  ) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params) => {
        this.code = params.get('code');
        return this.registerService.validate(this.code);
      }).subscribe(data => {
        this.registrationForm.controls.email.setValue((data as { email: string }).email);
      });
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.registrationForm.controls[userData.provider].setValue(userData.id);
        this.registrationForm.controls[userData.provider].markAsDirty();
      });
  }

  getPasswordErrorMessage() {
    return this.registrationForm.controls.password.hasError('required') ? 'You must enter a value' :
      this.registrationForm.controls.password.hasError('minlength') ? 'Password must contain at least 8 characters' :
        this.registrationForm.controls.password.hasError('pattern') ? 'Use at least one letter, one number and one special character' :
          '';
  }

  getPasswordConfirmationErrorMessage() {
    return 'Passwords must match';
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit() {
    if (this.isRegistrationComplete) {
      this.registerService.createUser(this.code, this.registrationForm.value)
        .switchMap(user => this.authService.authenticateLocal(
          { email: (user as any).username, password: this.registrationForm.value.password }))
        .subscribe(data => {
          if (data.user && data.token) {
            this.authService.setAuthInfo(data);
            this.router.navigate(['/workspace']);
          }
        });
    }
  }

  removeSocial(name) {
    this.registrationForm.controls[name].reset();
  }

  get isRegistrationComplete() {
    return !this.registrationForm.invalid &&
      (this.registrationForm.value.password || this.registrationForm.value.google || this.registrationForm.value.facebook);
  }

}
