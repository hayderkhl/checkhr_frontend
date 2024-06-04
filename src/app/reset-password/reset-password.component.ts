import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  token: string = '';
  newPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  resetPassword() {
    const params = new HttpParams()
      .set('token', this.token)
      .set('newPassword', this.newPassword);

    this.http.post('http://localhost:8094/auth/reset-password', params, { responseType: 'text' })
      .subscribe(
        (response) => {
          this.successMessage = 'Password reset successfully.';
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = 'Failed to reset password.';
          this.successMessage = '';
        }
      );
  }
}
