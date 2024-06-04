import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
  allLoans: any[] = [];
  pendingLoans: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchLoans();
  }

  fetchLoans() {
    this.http.get<any[]>('http://localhost:8094/loans').subscribe(
      (response) => {
        this.allLoans = response;
        this.pendingLoans = this.allLoans.filter(loan => loan.status === null);
      },
      (error) => {
        console.error('Error fetching loans: ', error);
      }
    );
  }

  approveLoan(id: string) {
    this.http.post(`http://localhost:8094/loans/approve/${id}`, {}).subscribe(
      () => {
        this.updateLoanStatus(id, true);
      },
      (error) => {
        console.error('Error approving loan: ', error);
      }
    );
  }

  declineLoan(id: string) {
    this.http.post(`http://localhost:8094/loans/decline/${id}`, {}).subscribe(
      () => {
        this.updateLoanStatus(id, false);
      },
      (error) => {
        console.error('Error declining loan: ', error);
      }
    );
  }

  updateLoanStatus(id: string, status: boolean) {
    const loan = this.allLoans.find(l => l.id_request === id);
    if (loan) {
      loan.status = status;
    }
    this.pendingLoans = this.allLoans.filter(loan => loan.status === null);
  }

}

