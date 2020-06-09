import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  DEBUG: Boolean = true;
  username: string;
  api: string;
  userName:Boolean;
  
  constructor(private http: HttpClient) {
    if (this.DEBUG) {
      this.api = 'http://localhost:3000';
    } else {
      this.api = 'http://localhost:8000';
    }
  }

  // Returns all members
  getMembers() {
    return this.http.get(`${this.api}/members`).pipe(catchError(this.handleError));
  }
  
  getTeams() {
    return this.http.get(`${this.api}/teams`).pipe(catchError(this.handleError));
  }

  setUsername(name: string): void {
    this.username = name;
  }

  addMember(memberForm) {
    //Adding new member to database
    return this.http
    .post(`${this.api}/members`, memberForm)
  }

  removeMember(memberId) {
    //Adding new member to database
    return this.http
    .delete(`${this.api}/members/` + memberId)
  }

  editMember( member, editingId) {
    return this.http
    .put(`${this.api}/members/` + editingId, member)
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return [];
  }
}
