import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient) {}

  getImage(employeeId: number): Observable<Blob> {

    
    return this.http.get(`http://localhost:8094/employees/photo/${employeeId}`, { responseType: 'blob' });
  }
}