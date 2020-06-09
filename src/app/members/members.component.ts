import { Member } from './../member-details/member.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit, OnDestroy {
  memberForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    jobTitle: new FormControl(''),
    status: new FormControl(),
    team :new FormControl()
  });
  members = [];
  teams;
  private editingId = null ;
  memberToEdit: Member;
  private subscription;
  private teamSub;
  editMember = false;
  constructor(public appService: AppService, private router: Router) {}

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.appService.getMembers().subscribe((members) => (this.members = members));
    this.appService.getTeams().subscribe((teams) => (this.teams = teams));
  }

  ngOnDestroy() {
  }

  goToAddMemberForm() {
    console.log('goto')
    this.router.navigate(['addmember']);
  }

  onSubmit( id ) {
    this.memberForm.value.id = id;
    this.memberToEdit = this.memberForm.value;
    this.appService.editMember( this.memberToEdit, this.editingId ).subscribe(
      data => {
        // refresh the list
        this.getData();
        return true;
      },
      error => {
        console.error("Error saving food!");
      }
    );
    this.editMember = false;
    this.memberForm.reset();
    this.editingId = null;
  }

  editMemberByID(member, id) {
    console.log('member to edit ',member);
    console.log('member to edit id ',id);

    this.editingId = id;
    this.memberToEdit = {...member};
    this.editMember = true;
  }

  deleteMemberById(id: number) {
    console.log('member to edit id ',id);
    const confirmation = confirm("Are you sure you want to delete this member?");
    if(confirmation) {
      this.appService.removeMember(id).subscribe(
        data => {
          // refresh the list
          console.log('delete',data);
          this.getData();
          return true;
        },
        error => {
          console.error("Error saving food!");
        }
      );
    }
  }
  backToMembers() {
    this.editMember = false;
    this.editingId = null;
    this.memberForm.reset();
  }
}
