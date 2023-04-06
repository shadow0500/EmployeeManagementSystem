import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeInfo } from '../dashboard/employeeInfo';
import { EmployeeService } from '../employee.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  formValue!: FormGroup;
  empObj: EmployeeInfo = new EmployeeInfo();
  empData: any = [];
  showAdd!: boolean;
  showUpdate!: boolean;
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];
  emailID: any;
  Add = false;

  constructor(
    private formbuilder: FormBuilder,
    private employee: EmployeeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      employeeid: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      department: ['', Validators.required],
      position: ['', Validators.required],
      experience: ['', Validators.required],
    });
    this.getAllEmployee();
  }
  clickAddEmployee() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  getAllEmployee() {
    this.employee.getEmployee().subscribe((res) => {
      this.empData = res;
    });
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.getAllEmployee();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getAllEmployee();
  }

  postEmployeeDetails(): void {
    this.empObj.employeeid = uuidv4();
    this.empObj.firstName = this.formValue.value.firstName;
    this.empObj.lastName = this.formValue.value.lastName;
    this.empObj.email = this.formValue.value.email;
    this.empObj.department = this.formValue.value.department;
    this.empObj.position = this.formValue.value.position;
    this.empObj.experience = this.formValue.value.experience;

    let employeeAlreadyExists = false;
    if (this.empData != null) {
      for (let i = 0; i < this.empData.length; i++) {
        if (this.empData[i].email == this.empObj.email) {
          employeeAlreadyExists = true;
        }
      }
    }
    if (!employeeAlreadyExists) {
      this.employee.postEmployee(this.empObj).subscribe(
        (res) => {
          console.log(res);
          alert('Employee added succesfully');
          let ref = document.getElementById('cancel');
          ref?.click();
          this.formValue.reset();
          this.getAllEmployee();
        },
        (err) => {
          alert('Something Wrong');
        }
      );
    } else {
      alert('Email already registered.');
    }
  }
  // onAdd(event: { preventDefault: () => void; }){
  //   event?.preventDefault();
  //   this.Add=true;
  //   if (this.formValue){
  //     console.log(this.formValue.value);
  //   }

  // }

  deleteEmployee(row: any) {
    if (window.confirm('Are you sure, you want to delete?')) {
      this.employee.deleteEmployee(row.id).subscribe((res) => {
        console.log(res);
        alert('Employee Deleted!');
        this.getAllEmployee();
      });
    }
  }
  onEdit(row: any) {
    this.emailID = row.email;
    this.showAdd = false;
    this.showUpdate = true;
    this.empObj.id = row.id;
    this.formValue.controls['employeeid'].setValue(row.employeeid);
    this.formValue.controls['firstName'].setValue(row.firstName);
    this.formValue.controls['lastName'].setValue(row.lastName);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['department'].setValue(row.department);
    this.formValue.controls['position'].setValue(row.position);
    this.formValue.controls['experience'].setValue(row.experience);
  }
  updateEmployeeDetails() {
    this.empObj.employeeid = uuidv4();
    this.empObj.firstName = this.formValue.value.firstName;
    this.empObj.lastName = this.formValue.value.lastName;
    this.empObj.email = this.formValue.value.email;
    this.empObj.department = this.formValue.value.department;
    this.empObj.position = this.formValue.value.position;
    this.empObj.experience = this.formValue.value.experience;

    const findEmployee = this.empData.filter(
      (_emp: any) =>
        _emp.email == this.empObj.email && this.empObj.email != this.emailID
    );
    if (findEmployee.length > 1) {
      alert('Email already exist');
    } else {
      this.employee
        .updateEmployee(this.empObj, this.empObj.id)
        .subscribe((res) => {
          alert('Updated Successfully');
          let ref = document.getElementById('cancel');
          ref?.click();
          this.formValue.reset();
          this.getAllEmployee();
        });
    }
  }
}
/* emailAlredyExist = "";
  emailCheckUnique() {
  this.ss.emailCheckUnique(this.formValue.controls['email'].value).subscribe((res: any) => {
    this.emailAlredyExist = res;
    if (this.emailAlredyExist.length > 0) {
      this.emailAlredyExist = "Email Alredy Exist";
    }
    else{
      this.emailAlredyExist = "";
    }
  });
  } */
