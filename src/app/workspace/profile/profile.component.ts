import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { AuthService as SocialAuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angular-6-social-login';
import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm = this.formBuilder.group({
    id: [''],
    email: [''],
    password: ['', [Validators.minLength(8), Validators.pattern(/(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\d\w])/)]],
    confirmPassword: [''],
    facebook: [''],
    google: ['']
  }, { validator: this.checkPasswords });

  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private userService: UserService) { }

  ngOnInit() {
    this.userService.getUserProfile(this.authService.getAuthInfo().id)
      .subscribe(user => this.setUserInfo(user));
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
        this.profileForm.controls[userData.provider].setValue(userData.id);
        this.profileForm.controls[userData.provider].markAsDirty();
      });
  }

  getPasswordErrorMessage() {
    return this.profileForm.controls.password.hasError('required') ? 'You must enter a value' :
      this.profileForm.controls.password.hasError('minlength') ? 'Password must contain at least 8 characters' :
        this.profileForm.controls.password.hasError('pattern') ? 'Use at least one letter, one number and one special character' :
          '';
  }

  getPasswordConfirmationErrorMessage() {
    return 'Passwords must match';
  }

  removeSocial(name) {
    this.profileForm.controls[name].reset();
    this.profileForm.controls[name].markAsDirty();
  }

  setUserInfo(user) {
    if (user.id === this.authService.getAuthInfo().id) {
      this.profileForm.controls.id.setValue(user.id);
      this.profileForm.controls.email.setValue(user.username);
      this.profileForm.controls.facebook.setValue(user.facebook ? user.facebook : '');
      this.profileForm.controls.google.setValue(user.google ? user.google : '');
      this.profileForm.markAsPristine();
    } else {
      this.authService.logout();
    }

  }

  onSubmit() {
    const form = this.profileForm.value;
    this.userService.setUserProfile({
      id: form.id,
      username: form.email,
      password: this.profileForm.controls.password.dirty ? form.password : undefined,
      google: this.profileForm.controls.google.dirty ? form.google === null ? '' : form.google : undefined,
      facebook: this.profileForm.controls.facebook.dirty ? form.facebook === null ? '' : form.facebook : undefined,
    })
      .subscribe(user => this.setUserInfo(user));
  }

  get isFormComplete() {
    return this.profileForm.dirty && !this.profileForm.invalid &&
      (this.profileForm.value.password || this.profileForm.value.google || this.profileForm.value.facebook);
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }
}
