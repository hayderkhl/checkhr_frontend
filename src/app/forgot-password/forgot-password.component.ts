import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  sendResetLink() {
    const params = new HttpParams().set('email', this.email);
    
    this.http.post('http://localhost:8094/auth/forgot-password', params, { responseType: 'text' })
      .subscribe(
        (response) => {
          this.successMessage = 'Password reset instructions sent to your email.';
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = 'Failed to send password reset instructions.';
          this.successMessage = '';
        }
      );
  }
}
