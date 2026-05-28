import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student, CreateStudentDto } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly baseUrl = 'https://studentmgmtsystembackend-bxb4btdka3e2aheh.centralindia-01.azurewebsites.net/api/Students';

  constructor(private http: HttpClient) {
    console.log('✅ StudentService ready. URL:', this.baseUrl);
  }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`);
  }

  addStudent(student: CreateStudentDto): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  searchById(id: number): Observable<Student[]> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Student[]>(`${this.baseUrl}/search`, { params })
      .pipe(catchError(() => of([])));
  }

  searchByName(name: string): Observable<Student[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Student[]>(`${this.baseUrl}/search`, { params })
      .pipe(catchError(() => of([])));
  }
}