import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-request-leave',
  templateUrl: './request-leave.component.html',
  styleUrls: ['./request-leave.component.css'],
})
export class RequestLeaveComponent implements OnInit {
  time: any = '';
  date: any = '';
  specifications: any = '';
  message: string = '';
  leaveRequests: any[] = []; // Add this line to store leave requests
  reportYear: number = 0;


  ngOnInit(): void {
    this.fetchLeaveRequests();
  }

  constructor(private http: HttpClient) {}

  onSubmit() {
    const token: any = localStorage.getItem('token');
    const decodedToken: any = jwt_decode(token);
    const request: any = {
      time: this.time,
      date: this.date,
      specifications: this.specifications,
      user: {
        id_user: decodedToken.userId,
      },
    };
    this.http.post('http://localhost:8094/leaves/request', request).subscribe(
      (res) => {
        console.log(res);
        this.message = 'Request has been submitted';
        this.fetchLeaveRequests(); // Fetch leave requests again after submitting
      },
      (err) => {
        console.log(err);
        this.message = 'Something happened , please try again !';
      }
    );
  }

  fetchLeaveRequests() {
    const token: any = localStorage.getItem('token');
    const decodedToken: any = jwt_decode(token);
    const userId = decodedToken.userId;
    this.http.get<any[]>(`http://localhost:8094/leaves/user/${userId}`).subscribe(
      (res) => {
        this.leaveRequests = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  generateReport(event: Event) {
    event.preventDefault();  // Prevent the default form submission
    if (this.reportYear) {
      const token: any = localStorage.getItem('token');
      const decodedToken: any = jwt_decode(token);
      const userId = decodedToken.userId;
      const url = `http://localhost:8094/report/leaves/user/${userId}/year/${this.reportYear}`;  // Corrected endpoint URL

      this.http.get(url, { responseType: 'blob' }).subscribe(
        response => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        },
        error => {
          console.error('Error generating report:', error);
        }
      );
    }
  }
}
