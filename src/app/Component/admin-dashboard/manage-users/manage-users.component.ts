import { Component, OnInit } from '@angular/core';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-users',
  imports: [CommonModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit {
learnerData: any[] = [];
  showAll: boolean = true;
activeLearners: any[] = [];
deactivatedLearners: any[] = [];
  constructor(private services: LmsservicesService) {}

  ngOnInit(): void {
    this.loadLearnerData();
  }

  loadLearnerData() {
  this.services.getAllLearner().subscribe({
    next: (value) => {
      this.learnerData = value;
      this.activeLearners = this.learnerData.filter(u => u.isActive);
      this.deactivatedLearners = this.learnerData.filter(u => !u.isActive);
      console.log('Learner data loaded:', this.learnerData);
    },
    error: (err) => {
      console.log('Error loading learners:', err);
    }
  });
}

  deactivateUser(userId: number) {
    this.services.deactivateUser(userId).subscribe({
      next: () => {
        console.log('User deactivated:', userId);
        this.loadLearnerData();
      },
      error: (err) => {
        console.error('Error deactivating user:', err);
      }
    });
  }

  activateUser(userId: number) {
    this.services.activateUser(userId).subscribe({
      next: () => {
        console.log('User activated:', userId);
        this.loadLearnerData();
      },
      error: (err) => {
        console.error('Error activating user:', err);
      }
    });
  }
}
