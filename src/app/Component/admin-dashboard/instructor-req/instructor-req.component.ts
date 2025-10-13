import { Component, HostListener, OnInit } from '@angular/core';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Instructor {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: string;
  address: string;
  profilePic: string;
  approvalStatus: string;
  isActive: boolean;
  rejectionReason: string;
}

@Component({
  selector: 'app-instructor-req',
  imports: [CommonModule, FormsModule],
  templateUrl: './instructor-req.component.html',
  styleUrl: './instructor-req.component.css'
})

export class InstructorReqComponent implements OnInit {



  instructors: Instructor[] = [];

  pendingInstructors: Instructor[] = [];
  approvedInstructors: Instructor[] = [];
  deactivatedInstructors: Instructor[] = [];
  rejectedInstructors: Instructor[] = [];

  isSectionOpen = {
    pending: true,
    approved: false,
    deactivated: false,
    rejected: false
  };

  isRejectModalOpen = false;
  selectedInstructorId: number | null = null;
  rejectReason: string = '';
  errorMessage: string = '';
  showReasonError: boolean = false;
  selectedImageUrl: string | null = null;
  isInstructorsOpen = false;


  constructor(private instructorService: LmsservicesService) { }

  ngOnInit() {
    this.loadInstructors();
   
  }

  //  Load instructors from API
  loadInstructors(): void {
    this.instructorService.getAllInstructors().subscribe({
      next: (data: Instructor[]) => {
        this.instructors = data;
       
        this.pendingInstructors = data.filter(i =>
          i.approvalStatus === 'Pending' && i.isActive === true
        );

        this.approvedInstructors = data.filter(i =>
          i.approvalStatus === 'Approved' && i.isActive === true
        );

        this.deactivatedInstructors = data.filter(i =>
          i.approvalStatus === 'Pending' && i.isActive === false
        );

        this.rejectedInstructors = data.filter(i =>
          i.approvalStatus === 'Rejected' && i.isActive === true
        );
      },
      error: (err) => {
        this.errorMessage = 'Failed to load instructors.';
        console.error(err);
      }
    });
  }



  // Accept instructor
  acceptInstructor(userId: number) {
    this.instructorService.acceptApprovalInstructors(userId).subscribe({
      next: (response) => {
        console.log('Instructor approved successfully:', response);
        this.loadInstructors();
      },
      error: (error) => {
        console.error('Error approving instructor:', error);
        this.errorMessage = 'Failed to approve instructor.';
      }
    });
  }

  openRejectModal(userId: number) {
    this.selectedInstructorId = userId;
    this.rejectReason = '';
    this.isRejectModalOpen = true;
  }

  submitRejection() {

    if (!this.rejectReason.trim()) {
      this.showReasonError = true;
      return;
    }

    if (!this.selectedInstructorId) {
      console.error("No instructor selected for rejection.");
      return;
    }

    this.showReasonError = false;

    const data = {
      reason: this.rejectReason.trim()
    };

    this.instructorService.RejectInstructors(this.selectedInstructorId, data).subscribe({
      next: (response) => {
        console.log('Instructor rejected:', response);
        this.closeRejectModal();
        this.loadInstructors();
      },
      error: (error) => {
        console.error('Error rejecting instructor:', error);
        this.errorMessage = 'Failed to reject instructor.';
      }
    });
  }

  deactivateInstructor(userId: number) {
    const confirmed = confirm('Are you sure you want to deactivate this instructor?');
    if (!confirmed) return;

    this.instructorService.deactivateUser(userId).subscribe({
      next: (response) => {
        console.log('Instructor deactivated:', response);
        this.loadInstructors();
      },
      error: (error) => {
        console.error('Failed to deactivate instructor:', error);
        this.errorMessage = 'Failed to deactivate instructor.';
      }
    });
  }

  activateInstructor(userId: number) {
    this.instructorService.activateUser(userId).subscribe({
      next: (response) => {
        console.log('Instructor activated:', response);
        this.loadInstructors();
      },
      error: (error) => {
        console.error('Failed to activate instructor:', error);
        this.errorMessage = 'Failed to activate instructor.';
      }
    });
  }

  closeRejectModal() {
    this.isRejectModalOpen = false;
    this.selectedInstructorId = null;
    this.rejectReason = '';
  }

  toggleSection(section: 'pending' | 'approved' | 'deactivated' | 'rejected') {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }


  showImageFullScreen(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
  }

  closeImageModal() {
    this.selectedImageUrl = null;
  }
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.isRejectModalOpen) {
      this.closeRejectModal();

    }
    if (this.selectedImageUrl) {
      this.closeImageModal();
    }
  }


  
}
