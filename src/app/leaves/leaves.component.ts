

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css'],
})
export class LeavesComponent implements OnInit {
  allLeaves: any[] = []; // Replace with your actual leave model
  pendingLeaves: any[] = []; // Replace with your actual leave model

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllLeaves();
  }

  fetchAllLeaves() {
    this.http.get('http://localhost:8094/leaves').subscribe((response: any) => {
      this.allLeaves = response;
      this.pendingLeaves = this.allLeaves.filter((leave) => leave.status === null);
      this.allLeaves.forEach((leave) => {
        this.fetchUserPhoto(leave);
      });
    });
  }

  approveLeave(requestId: number) {
    this.http
      .post('http://localhost:8094/leaves/approve/' + requestId, {})
      .subscribe(() => {
        this.updateLeaveStatus(requestId, true);
      });
  }

  declineLeave(requestId: number) {
    this.http
      .post('http://localhost:8094/leaves/decline/' + requestId, {})
      .subscribe(() => {
        this.updateLeaveStatus(requestId, false);
      });
  }

  updateLeaveStatus(requestId: number, status: boolean) {
    const leave = this.allLeaves.find((leave) => leave.id === requestId);
    if (leave) {
      leave.status = status;
    }
    this.pendingLeaves = this.allLeaves.filter((leave) => leave.status === null);
  }

  private fetchUserPhoto(leave: any): void {
    const employeeId = leave.user.id_user; // Use id_user from the leave object

    if (employeeId) {
      this.http
        .get(`http://localhost:8094/employees/photo/${employeeId}`, {
          responseType: 'blob',
        })
        .subscribe(
          (photoBlob: Blob) => {
            const reader = new FileReader();
            reader.onload = () => {
              leave.userPhoto = reader.result as string;
            };
            reader.readAsDataURL(photoBlob);
          },
          (error) => {
            console.error('Error fetching user photo', error);
          }
        );
    }
  }

  getImageSource(leave: any): string {
    return leave.userPhoto || 'assets/6596121.png';
  }
}
