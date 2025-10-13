import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-detail',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {



  courseId!: number;
  course: any;
  showUnits = false;
  showContents = false;
  showQuizzes = false;
  showQuestions = false;

  activeSection: 'units' | 'contents' | 'quizzes' | 'questions' | null = null;

  // Add Unit modal controls
  showAddUnitModal = false;
  newUnitTitle = '';
  newUnitOrder: number | null = null;

  // Edit Unit Modal
  showEditUnitModal = false;
  editUnitId!: number;
  editUnitTitle: string = '';
  editUnitOrder!: number;

  message: string = '';
  unitMessage: string = '';
  unitMessageType: 'success' | 'error' | '' = '';

  //add content 
  showContentModal = false;
  isEditMode = false;
  selectedFile: File | null = null;
  successMessageVideo = '';
  errorMessageVideo = '';
  contentForm!: FormGroup;
  filteredUnits: any[] = [];

  // Add Quiz Modal

  showAddQuizModal = false;
  isEditQuizMode = false;
  editQuizId!: number;
  quizForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  isLoading: boolean = false;


  // Question
  showQuestionModal = false;
  questionForm!: FormGroup;
  questionSuccessMessage = '';
  questionErrorMessage = '';

  //edit course
  showEditCourseModal = false;
  courseForm!: FormGroup;
  selectedThumbnail: File | null = null;
  previewUrl: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lmsService: LmsservicesService,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();

    this.contentForm = this.fb.group({
      unitId: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]]
    });

    this.courseForm = this.fb.group({
      courseId: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

//edit course
openEditCourseModal(course: any) {
  this.showEditCourseModal = true;
  this.previewUrl = 'https://localhost:7000' + course.thumbnailUrl;

  this.courseForm.patchValue({
    courseId: course.courseId,
    title: course.title,
    description: course.description,
  });
}

closeEditCourseModal() {
  this.showEditCourseModal = false;
  this.selectedThumbnail = null;
  this.previewUrl = null;
  this.courseForm.reset();
}

onThumbnailSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedThumbnail = file;
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(file);
  }
}


updateCourse() {
  if (this.courseForm.invalid) {
    this.courseForm.markAllAsTouched();
    return;
  }

  const formData = new FormData();
  formData.append('title', this.courseForm.get('title')?.value);
  formData.append('description', this.courseForm.get('description')?.value);
  formData.append('courseId', this.courseForm.get('courseId')?.value);

 if (this.selectedThumbnail) {
    formData.append('ThumbnailUrl', this.selectedThumbnail);
  }

  this.lmsService.updateCourse(this.courseId, formData).subscribe({
    next: () => {
      this.showEditCourseModal = false;
      this.loadCourse();
    },
    error: (err) => {
      console.error('Error updating course:', err);
    }
  });
}


onDeleteCourse(courseId: number) {
  if (confirm('Are you sure you want to delete this course?')) {
    this.lmsService.deleteCourse(courseId).subscribe({
      next: () => {
        this.router.navigate(['/instructor-dashboard/mycourse']);
      },
      error: (err) => {
        console.error('Failed to delete course:', err);
      }
    });
  }
}



  loadCourse() {
    this.lmsService.getInstructorCourseById(this.courseId).subscribe({
      next: (res) => {
      

        if (res.quizzes) {
          res.quizzes.forEach((quiz: any) => {
            if (quiz.questions) {
              quiz.questions.forEach((q: any) => {
                try {
                  q.options = JSON.parse(q.options);
                } catch {
                  q.options = [];
                }
              });
            }
          });
        }
        this.course = res;

        if (res.units && Array.isArray(res.units)) {
          this.filteredUnits = res.units;
        } else {
          this.filteredUnits = [];
        }

      },
      error: (err) => {
        console.error('Error loading course', err);
      }
    });
  }



  toggleSection(section: 'units' | 'contents' | 'quizzes' | 'questions') {
    this.activeSection = this.activeSection === section ? null : section;
  }


  // =============== ADD UNIT ===============
  onAddUnit() {
    this.newUnitTitle = '';
    this.newUnitOrder = null;
    this.showAddUnitModal = true;
  }

  closeAddUnitModal() {
    this.showAddUnitModal = false;
    this.newUnitTitle = '';
    this.newUnitOrder = null;
  }

  submitAddUnit() {
    this.unitMessage = '';
    this.unitMessageType = '';

    if (!this.newUnitTitle || this.newUnitTitle.trim() === '') {
      this.unitMessage = 'Please enter unit title.';
      this.unitMessageType = 'error';
      return;
    }

    if (this.newUnitOrder === null || this.newUnitOrder < 0) {
      this.unitMessage = 'Please enter a valid order number.';
      this.unitMessageType = 'error';
      return;
    }

    const payload = {
      title: this.newUnitTitle.trim(),
      order: this.newUnitOrder,
      courseId: this.courseId
    };

    this.lmsService.addUnit(payload).subscribe({
      next: (res) => {
        this.unitMessage = ' Unit added successfully!';
        this.unitMessageType = 'success';
        this.closeAddUnitModal();
        this.loadCourse();
      },
      error: (err) => {
        console.error('Error adding unit:', err);
        this.unitMessage = ' Failed to add unit. Please try again.';
        this.unitMessageType = 'error';
      }
    });
  }


  onEditUnit(index: number) {

    const unit = this.course.units[index];
    this.editUnitId = unit.unitId;
    this.editUnitTitle = unit.title;
    this.editUnitOrder = unit.order;
    this.showEditUnitModal = true;
  }

  closeEditUnitModal() {
    this.showEditUnitModal = false;
    this.editUnitTitle = '';
    this.editUnitOrder = 0;
  }

  submitEditUnit() {
    if (!this.editUnitTitle || !this.editUnitOrder) {
      this.message = 'Both title and order are required';
      return;
    }

    const payload = {
      unitId: this.editUnitId,
      title: this.editUnitTitle.trim(),
      order: this.editUnitOrder,
      courseId: this.courseId
    };

    this.lmsService.updateUnit(payload).subscribe({
      next: () => {
        this.message = 'Unit updated successfully!';
        this.showEditUnitModal = false;
        this.message = '';
        this.loadCourse();
      },
      error: (err) => {
        console.error('Error updating unit:', err);
        this.message = 'Failed to update unit.';
      }
    });
  }


  onDeleteUnit(index: number) {
    const unit = this.course.units[index];
    if (confirm(`Are you sure you want to delete unit "${unit.title}"?`)) {
      this.lmsService.deleteUnit(unit.unitId || unit.id).subscribe({
        next: (res) => {
          this.message = 'Unit deleted successfully!';
          this.loadCourse();
        },
        error: (err) => {
          console.error('Error deleting unit:', err);
          this.message = 'Failed to delete unit.';
        }
      });
    }
  }


  // add CONTENT FUNCTIONS

  onAddContent(unit: any) {
    this.isEditMode = false;
    this.showContentModal = true;
    this.contentForm.reset();
    this.contentForm.patchValue({ unitId: unit.unitId });
    this.selectedFile = null;
    this.successMessageVideo = '';
    this.errorMessageVideo = '';
  }


  onEditContent(unit: any) {
    this.isEditMode = true;
    this.showContentModal = true;

    const content = unit.contents && unit.contents.length > 0 ? unit.contents[0] : null;
    if (content) {
      this.contentForm.patchValue({
        unitId: unit.unitId,
        duration: content.duration
      });
    }
  }

  closeContentModal() {
    this.showContentModal = false;
    this.successMessageVideo = '';
    this.errorMessageVideo = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  onSubmitVideo() {
    if (this.contentForm.invalid) {
      this.contentForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('unitId', this.contentForm.get('unitId')?.value);
    formData.append('duration', this.contentForm.get('duration')?.value);
    if (this.selectedFile) formData.append('file', this.selectedFile);

    this.lmsService.addUnitContent(formData).subscribe({
      next: (res) => {
        this.successMessageVideo = this.isEditMode
          ? 'Content updated successfully!'
          : 'Content uploaded successfully!';
        setTimeout(() => {
          this.closeContentModal();
          this.loadCourse();
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.errorMessageVideo = 'Failed to upload content.';
      },
    });
  }


  onDeleteContent(unitIndex: number, contentIndex: number, contentId: number) {
    if (confirm('Are you sure you want to delete this content?')) {
      this.lmsService.deleteContent(contentId).subscribe({
        next: () => {
          // Remove from UI
          this.course.units[unitIndex].contents.splice(contentIndex, 1);
        },
        error: (err) => {
          console.error('Failed to delete content:', err);
        }
      });
    }
  }

  //Add  QUIZZES 

  onAddQuiz() {
    this.isEditMode = false;
    this.isEditQuizMode = false;
    this.quizForm = this.fb.group({
      courseId: [this.courseId, Validators.required],
      title: ['', Validators.required],
      duration: [1, [Validators.required, Validators.min(1)]]
    });
    this.successMessage = '';
    this.errorMessage = '';
    this.showAddQuizModal = true;
  }

  onEditQuiz(quiz: any) {
    this.isEditMode = true;
    this.isEditQuizMode = true;
    this.editQuizId = quiz.quizId;
    this.quizForm = this.fb.group({
      courseId: [this.courseId, Validators.required],
      title: [quiz.title, Validators.required],
      duration: [quiz.duration, [Validators.required, Validators.min(1)]]
    });
    this.successMessage = '';
    this.errorMessage = '';
    this.showAddQuizModal = true;
  }

  submitQuiz() {
    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      return;
    }

    const payload = this.quizForm.value;

    if (this.isEditQuizMode) {

      this.lmsService.updateQuiz(this.editQuizId, payload).subscribe({
        next: () => {
          this.successMessage = 'Quiz updated successfully!';
          this.loadCourse();
          this.closeQuizModal();
        },
        error: () => this.errorMessage = 'Failed to update quiz. Please try again.'
      });
    } else {

      this.lmsService.createQuiz(payload).subscribe({
        next: () => {
          this.successMessage = 'Quiz created successfully!';
          this.loadCourse();
          this.closeQuizModal();
        },
        error: () => this.errorMessage = 'Failed to create quiz. Please try again.'
      });
    }
  }

  closeQuizModal() {
    this.showAddQuizModal = false;
  }



  //Quizzes content

  onAddQuestion(quizIndex: number) {
    this.questionSuccessMessage = '';
    this.questionErrorMessage = '';
    this.showQuestionModal = true;

    this.questionForm = this.fb.group({
      text: ['', Validators.required],
      options: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      quizId: [this.course.quizzes[quizIndex].quizId]
    });
  }

  onSubmitQuestion() {
    if (this.questionForm.invalid) {
      this.questionErrorMessage = 'Please fill all fields correctly.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const formValue = this.questionForm.value;

    const optionsArray = formValue.options.split(',').map((opt: string) => opt.trim());

    if (optionsArray.length < 3) {
      this.questionErrorMessage = 'Options must have at least 3 items.';
      return;
    }

    formValue.options = JSON.stringify(optionsArray);

    this.lmsService.createQuqstions(formValue).subscribe({
      next: () => {
        this.questionSuccessMessage = 'Question added successfully!';
        this.showQuestionModal = false;

        const quizIndex = this.course.quizzes.findIndex((q: any) => q.quizId === formValue.quizId);
        if (quizIndex !== -1) {
          if (!this.course.quizzes[quizIndex].questions) this.course.quizzes[quizIndex].questions = [];
          this.course.quizzes[quizIndex].questions.push(formValue);
        }

        this.loadCourse();
      },
      error: (err) => {
        console.log(err.error);
        this.questionErrorMessage = err.error?.message || 'Failed to add question.';
      }
    });
  }

  closeQuestionModal() {
    this.showQuestionModal = false;
    this.questionErrorMessage = '';
    this.questionSuccessMessage = '';
  }

  onDeleteQuestion(quizIndex: number, questionIndex: number, questionId: number) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.lmsService.deleteQuestion(questionId).subscribe({
        next: () => {
          this.course.quizzes[quizIndex].questions.splice(questionIndex, 1);
          console.log(`Deleted question ${questionIndex} from quiz ${quizIndex}`);
        },
        error: (err) => {
          console.error('Failed to delete question:', err);

        }
      });
    }

  
  }
}
