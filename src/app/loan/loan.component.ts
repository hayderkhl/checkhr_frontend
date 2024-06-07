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
        this.allLoans.forEach((loan) => {
          this.fetchUserPhoto(loan);
        });
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

  private fetchUserPhoto(loan: any): void {
    const employeeId = loan.user.id_user; // Use id_user from the leave object

    if (employeeId) {
      this.http
        .get(`http://localhost:8094/employees/photo/${employeeId}`, {
          responseType: 'blob',
        })
        .subscribe(
          (photoBlob: Blob) => {
            const reader = new FileReader();
            reader.onload = () => {
              loan.userPhoto = reader.result as string;
            };
            reader.readAsDataURL(photoBlob);
          },
          (error) => {
            console.error('Error fetching user photo', error);
          }
        );
    }
  }

  getImageSource(loan: any): string {
    return loan.userPhoto || 'assets/6596121.png';
  }

}

