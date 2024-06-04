import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent {
  employee: any = {
    username: '',
    password: '',
    role: 'EMPLOYEE',
    birthdate: '',
    age: 0,
    phonenumber: 0,
    education: '',
    address: '',
    fullName: '',
  };

  selectedFile: File | null = null;
  imageUrl: SafeUrl | null = null;

  constructor(private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  manage() {
    window.location.href = 'http://localhost:4200/employees';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;

      // Show preview of the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  addEmployee() {
    const formData = new FormData();
    formData.append('username', this.employee.username);
    formData.append('password', this.employee.password);
    formData.append('role', this.employee.role);
    formData.append('birthdate', this.employee.birthdate);
    formData.append('age', this.employee.age.toString());
    formData.append('phonenumber', this.employee.phonenumber.toString());
    formData.append('education', this.employee.education);
    formData.append('address', this.employee.address);
    formData.append('fullName', this.employee.fullName);
    
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    // Send a POST request to add a new employee with photo
    console.log(this.employee);
    this.http.post('http://localhost:8094/auth/addUser', formData).subscribe(
      (response: any) => {
        // Handle a successful employee addition
        console.log('Employee added successfully:', response);
        // You can perform further actions like redirection or displaying a success message
        window.location.reload();
      },
      (error) => {
        // Handle errors, such as validation errors or server issues
        console.log('Error adding employee:', error);
        // You can display an error message to the user
      }
    );
  }
}

