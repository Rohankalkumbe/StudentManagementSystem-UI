import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student, CreateStudentDto } from '../../models/student.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent implements OnInit {

  isEditMode = false;
  studentId: number | null = null;
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  originalStudent: Student | null = null;

  student: CreateStudentDto = {
    name: '',
    age: 0,
    course: '',
    phone: ''
  };

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Read ID from URL like /#/edit/3
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('🔍 Route param id:', id);
      if (id) {
        this.isEditMode = true;
        this.studentId = parseInt(id);
        this.loadStudent(this.studentId);
      }
    });
  }

  loadStudent(id: number) {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('📡 Loading student with ID:', id);

    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        console.log('✅ Student data received:', data);
        this.originalStudent = data;
        this.student = {
          name: data.name,
          age: data.age,
          course: data.course,
          phone: data.phone
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load student:', err);
        this.errorMessage = '❌ Could not load student data. Please go back and try again.';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (!this.student.name.trim()) {
      this.errorMessage = '⚠️ Please enter student name.'; return;
    }
    if (this.student.age < 1 || this.student.age > 100) {
      this.errorMessage = '⚠️ Please enter valid age (1-100).'; return;
    }
    if (!this.student.course.trim()) {
      this.errorMessage = '⚠️ Please enter course name.'; return;
    }
    if (!this.student.phone.trim()) {
      this.errorMessage = '⚠️ Please enter phone number.'; return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditMode && this.studentId) {
      const updateData: Student = {
        id: this.studentId,
        name: this.student.name,
        age: this.student.age,
        course: this.student.course,
        phone: this.student.phone
      };
      console.log('📤 Updating:', updateData);

      this.studentService.updateStudent(this.studentId, updateData).subscribe({
        next: () => {
          this.successMessage = `✅ ${this.student.name} updated successfully!`;
          this.isSaving = false;
          setTimeout(() => this.router.navigate(['/']), 1500);
        },
        error: (err) => {
          console.error('❌ Update failed:', err);
          this.errorMessage = '❌ Failed to update. Please try again.';
          this.isSaving = false;
        }
      });
    } else {
      console.log('📤 Adding:', this.student);

      this.studentService.addStudent(this.student).subscribe({
        next: () => {
          this.successMessage = `✅ ${this.student.name} added successfully!`;
          this.isSaving = false;
          setTimeout(() => this.router.navigate(['/']), 1500);
        },
        error: (err) => {
          console.error('❌ Add failed:', err);
          this.errorMessage = '❌ Failed to add student. Please try again.';
          this.isSaving = false;
        }
      });
    }
  }

  onReset() {
    if (this.isEditMode && this.originalStudent) {
      this.student = {
        name: this.originalStudent.name,
        age: this.originalStudent.age,
        course: this.originalStudent.course,
        phone: this.originalStudent.phone
      };
    } else {
      this.student = { name: '', age: 0, course: '', phone: '' };
    }
    this.errorMessage = '';
    this.successMessage = '';
  }
}