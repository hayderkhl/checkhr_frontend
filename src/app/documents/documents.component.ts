import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit {
  userName: string = '';
  documents: any[] = []; // Replace with your actual document model
  uploadMessage: string = '';
  userId: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchDocuments();
    this.fetchUserPhoto();
  }

  fetchUserData() {
    const token: any = localStorage.getItem('token');
    const decodedToken: any = jwt_decode(token);
    this.userId = decodedToken.userId;
    this.userName = decodedToken.sub;
    this.documents.forEach((document) => {
      
    });
  }

  getFileExtension(filename: string): string | null {
    const lastIndex = filename.lastIndexOf('.');
    return lastIndex === -1 ? null : filename.slice(lastIndex + 1);
  }

  fetchDocuments() {
    const documentsApiUrl = `http://localhost:8094/documents/user/${this.userId}`;
    this.http.get<any[]>(documentsApiUrl).subscribe(
      (response) => {
        this.documents = response;
       
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', this.userId.toString());

      this.http.post('http://localhost:8094/documents/upload', formData).subscribe(
        (response: any) => {
          this.uploadMessage = 'File uploaded successfully.';
          this.fetchDocuments();
        },
        (error) => {
          this.uploadMessage = 'Error uploading file.';
          console.error('Error uploading file:', error);
        }
      );
    }
  }

  downloadDocument(documentId: number) {
    this.http.get('http://localhost:8094/documents/download/' + documentId, {
      responseType: 'arraybuffer',
    }).subscribe(
      (response: ArrayBuffer) => {
        this.handleDownloadedDocument(response, documentId);
      },
      (error) => {
        console.error('Error downloading document:', error);
      }
    );
  }

  handleDownloadedDocument(content: ArrayBuffer, documentId: number) {
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = 'document_' + documentId + '.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  deleteDocument(documentId: number) {
    if (confirm('Are you sure you want to delete this document?')) {
      this.http.delete(`http://localhost:8094/documents/${documentId}`).subscribe(
        (response) => {
          console.log('Delete response:', response);
          this.fetchDocuments(); // Refresh the document list after deletion
          console.log('Document deleted successfully');
        },
        (error) => {
          console.error('Error deleting document:', error);
        }
      );
    }
  }

  fetchUserPhoto(): void {
    const token: any = localStorage.getItem('token');
    const decodedToken: any = jwt_decode(token);
    const userId = decodedToken.userId;
  
    this.http
      .get(`http://localhost:8094/employees/photo/${userId}`, { responseType: 'blob' })
      .subscribe(
        (photoBlob: Blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            this.documents.forEach((document) => {
              if (document.user.id_user === userId) {
                document.userPhoto = reader.result as string;
                console.log('Fetched user photo for', document);
              }
            });
          };
          reader.readAsDataURL(photoBlob);
        },
        (error) => {
          console.error('Error fetching user photo', error);
        }
      );
  }

  getImageSource(document: any): string {
    return document.userPhoto || 'assets/6596121.png';
  }

  uploadDocument() {}
}
