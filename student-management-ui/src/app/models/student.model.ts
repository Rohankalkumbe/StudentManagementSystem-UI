export interface Student {
  id: number;
  name: string;
  age: number;
  course: string;
  phone: string;
}

export interface CreateStudentDto {
  name: string;
  age: number;
  course: string;
  phone: string;
}

