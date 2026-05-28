import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {

  allStudents: Student[] = [];
  students: Student[] = [];
  searchQuery = '';
  isLoading = true;
  isSearching = false;
  errorMessage = '';
  noSearchResults = false;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.isLoading = true;
    this.errorMessage = '';
    this.noSearchResults = false;

    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.allStudents = data;
        this.students = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.errorMessage = 'Cannot connect to API.';
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    const query = this.searchQuery.trim();
    if (!query) {
      this.students = this.allStudents;
      this.noSearchResults = false;
      return;
    }

    this.isSearching = true;
    const isNumber = /^\d+$/.test(query);

    if (isNumber) {
      this.studentService.searchById(parseInt(query)).subscribe({
        next: (data) => {
          this.handleSearchResult(data, query);
          this.isSearching = false;
        },
        error: () => {
          this.localSearch(query);
          this.isSearching = false;
        }
      });
    } else {
      this.studentService.searchByName(query).subscribe({
        next: (data) => {
          this.handleSearchResult(data, query);
          this.isSearching = false;
        },
        error: () => {
          this.localSearch(query);
          this.isSearching = false;
        }
      });
    }
  }

  handleSearchResult(data: Student[], query: string) {
    if (data && data.length > 0) {
      this.students = data;
      this.noSearchResults = false;
    } else {
      this.localSearch(query);
    }
  }

  localSearch(query: string) {
    const q = query.toLowerCase();
    const filtered = this.allStudents.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.id.toString() === q ||
      s.course.toLowerCase().includes(q) ||
      s.phone.includes(q)
    );
    this.students = filtered;
    this.noSearchResults = filtered.length === 0;
  }

  onClear() {
    this.searchQuery = '';
    this.students = this.allStudents;
    this.noSearchResults = false;
  }

  deleteStudent(id: number, name: string) {
    if (confirm(`Delete "${name}"?`)) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.allStudents = this.allStudents.filter(s => s.id !== id);
          this.students = this.students.filter(s => s.id !== id);
        },
        error: () => alert('❌ Failed to delete.')
      });
    }
  }

  getAvatarColor(name: string): string {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500',
      'bg-rose-500', 'bg-amber-500', 'bg-teal-500',
      'bg-indigo-500', 'bg-pink-500'
    ];
    return colors[name.charCodeAt(0) % colors.length];
  }
}