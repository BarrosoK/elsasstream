import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  successMessage = '';
  errorMessage = '';

  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    passwordConfirmation: ['', [
      Validators.required,
      this.matchOtherValidator('password')
    ]],
    email: ['', [Validators.required, Validators.email]]
  });

  matchOtherValidator(otherControlName: string) {

    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOtherValidate(control: FormControl) {

      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      if (!thisControl) {
        thisControl = control;
        otherControl = control.parent.get(otherControlName) as FormControl;
        if (!otherControl) {
          throw new Error('matchOtherValidator(): other control is not found in parent group');
        }
        otherControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }

      if (!otherControl) {
        return null;
      }

      if (otherControl.value !== thisControl.value) {
        return {
          matchOther: true
        };
      }

      return null;
    };

  }

    constructor(private fb: FormBuilder, private router: Router, public afAuth: AngularFireAuth, private authService: AuthService) {
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.doRegister(this.registerForm.getRawValue())
      .then(res => {
        console.log(res);
        this.errorMessage = '';
        this.successMessage = 'Your account has been created';
        this.router.navigate(['/animes']);
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = '';
      });
  }

}
