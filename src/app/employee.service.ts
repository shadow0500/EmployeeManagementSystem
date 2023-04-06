import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  post(arg0: string, arg1: { email: any; }) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}
  

  postEmployee(data: any) {
    return this.http.post('http://localhost:3000/posts', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getEmployee() {
    return this.http.get('http://localhost:3000/posts').pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  updateEmployee(data: any, id: number) {
    return this.http.put(`http://localhost:3000/posts/${id}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  deleteEmployee(id: number) {
    return this.http.delete(`http://localhost:3000/posts/${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
