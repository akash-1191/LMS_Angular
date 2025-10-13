import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LmsservicesService } from '../../../../services/lmsservices.service';

@Component({
  selector: 'app-learprofile',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './learprofile.component.html',
  styleUrl: './learprofile.component.css'
})
export class LearprofileComponent implements OnInit {

 editProfileForm!: FormGroup;
  profileData: any;
  isEditProfileModalOpen = false;
  isImageUploadModalOpen = false;
  selectedImageFile: File | null = null;

  successMessage: string = '';
  errorMessage: string = '';
imageerrorMessage:string='';
  constructor(private profileService: LmsservicesService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editProfileForm = this.fb.group({
      fullName: ['', [Validators.required,Validators.pattern(/^[A-Za-z]+( [A-Za-z]+)+$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', Validators.required],
      age: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      gender: ['', Validators.required]
    });

    this.loadProfileData();
  }

  loadProfileData() {
    this.profileService.getProfileData().subscribe({
      next: (data) => {
        this.profileData = data;
        // console.log('Profile data loaded:', this.profileData);
        this.editProfileForm.patchValue({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          address: data.address,
          age: data.age,
          gender: data.gender
        });
      },
      error: (err) => {
        console.error('Failed to load profile data:', err);
        this.errorMessage = 'Failed to load profile data.';
      }
    });
  }
  
  onUpdateProfile() {
    this.clearMessages();

    if (this.editProfileForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    const userId = this.profileData?.userId || this.profileData?.id;
 
    if (!userId) {
      this.errorMessage = 'User ID not found.';
      return;
    }

    const updatedData = this.editProfileForm.value;
    console.log("update value",updatedData);
    this.profileService.updateProfileData(userId, updatedData).subscribe({
      next: (res) => {
        console.log('Profile updated:', res);
        this.successMessage = 'Profile updated successfully!';
        this.closeEditProfileModal();
        this.loadProfileData();
        this.autoClearMessages();
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.errorMessage = 'Failed to update profile!';
        this.autoClearMessages();
      }
    });
  }

  submitImageUpload() {
    this.clearMessages();

    if (!this.selectedImageFile) {
      this.errorMessage = 'Please select an image first!';
      return;
    }

    const userId = this.profileData?.userId || this.profileData?.id;
    if (!userId) {
      this.errorMessage = 'User ID not found.';
      return;
    }

    this.profileService.updateProfilePic(userId, this.selectedImageFile).subscribe({
      next: (res) => {
        console.log('Profile picture updated:', res);
        this.successMessage = 'Profile picture updated successfully!';
        this.closeImageUploadModal();
        this.loadProfileData();
        this.autoClearMessages();
      },
      error: (err) => {
        console.error('Error updating picture:', err);
        this.errorMessage = 'Failed to update profile picture!';
        this.autoClearMessages();
      }
    });
  }


  openEditProfileModal() {
    this.isEditProfileModalOpen = true;
  }
  closeEditProfileModal() {
    this.isEditProfileModalOpen = false;
  }
  openImageUploadModal() {
    this.isImageUploadModalOpen = true;
  }
  closeImageUploadModal() {
    this.isImageUploadModalOpen = false;
  }
  
  onImageSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      this.imageerrorMessage = 'Invalid file type! Please select a PNG or JPG image.';
      this.selectedImageFile = null;
      event.target.value = ''; 
      this.autoClearMessages();
      return;
    }
    this.imageerrorMessage = '';  
    this.selectedImageFile = file;
    console.log('Selected image:', file);
  }
}

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
    this.imageerrorMessage='';
  }

  autoClearMessages() {
    setTimeout(() => {
      this.clearMessages();
    }, 4000); 
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    debugger
    if (event.key === 'Escape' || event.key === 'Esc') {
      if (this.isImageUploadModalOpen) {
        this.closeImageUploadModal();
      }
      if (this.isEditProfileModalOpen) {
        this.closeEditProfileModal();
      }
    }
  }
}
