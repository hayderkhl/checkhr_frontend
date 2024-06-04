import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-request-loan',
  templateUrl: './request-loan.component.html',
  styleUrls: ['./request-loan.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class RequestLoanComponent implements OnInit {
  loanAmount: number;
  loanDate: string;
  loanDescription: string;
  message: string | null = null;
  loans: any[] = []; // Array to store loan data

  constructor(private http: HttpClient) {
    this.loanAmount = 0;
    this.loanDate = new Date().toISOString().slice(0, 10);
    this.loanDescription = '';
  }

  ngOnInit(): void {
    this.fetchLoans(); // Fetch loans on component initialization
  }

  submitLoanRequest() {
    const token: any = localStorage.getItem('token');
    const decodedToken: any = jwt_decode(token);
    const userId = decodedToken.userId;

    const loanRequest = {
      date: this.loanDate,
      amount: this.loanAmount,
      user: {
        id_user: Number(userId),
      },
      specification: this.loanDescription,
    };

    this.http.post('http://localhost:8094/loans/request', loanRequest).subscribe(
      (response: any) => {
        console.log('Loan request successful:', response);
        this.message = 'Loan request successful';
        this.clearForm();
        this.fetchLoans(); // Refresh the loan list after submission
      },
      (error) => {
        console.error('Loan request error:', error);
        this.message = 'Loan request failed';
      }
    );
  }

  fetchLoans() {
    const token: any = localStorage.getItem('token');
    const decodedToken: any = jwt_decode(token);
    const userId = decodedToken.userId;

    this.http.get(`http://localhost:8094/loans/user/${userId}`).subscribe(
      (response: any) => {
        this.loans = response;
      },
      (error) => {
        console.error('Failed to fetch loans:', error);
        this.message = 'Failed to fetch loans';
      }
    );
  }

  clearForm() {
    this.loanAmount = 0;
    this.loanDate = new Date().toISOString().slice(0, 10);
    this.loanDescription = '';
  }
}
