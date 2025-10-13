import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-content',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-content.component.html',
  styleUrl: './add-content.component.css'
})
export class AddContentComponent implements OnInit {

   activeTab: 'video' | 'question' = 'video';

  // Video form
  contentForm!: FormGroup;
  selectedFile: File | null = null;

  // Dynamic Question Form
  multiQuestionForm!: FormGroup;
  questionCountInput: number = 0;

  // JSON file upload
  selectedQuestionFile: File | null = null;
  successMessageFile = '';
  errorMessageFile = '';

  // Route IDs
  courseId!: number;
  unitId!: number;
  quizId!: number;

  // Unit data
  units: any[] = [];
  filteredUnits: any[] = [];
  uploadedUnitIds: number[] = [];

  // Messages
  successMessageVideo = '';
  errorMessageVideo = '';
  successMessageQuestion = '';
  errorMessageQuestion = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lmsService: LmsservicesService
  ) { }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    const urlSegments = this.route.snapshot.url;
    this.quizId = Number(urlSegments[urlSegments.length - 1]?.path);

    this.initForms();
    this.loadUnitsAndContents();
  }

  initForms() {
    this.contentForm = this.fb.group({
      unitId: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
    });

    this.multiQuestionForm = this.fb.group({
      questions: this.fb.array([]),
    });

    this.contentForm.get('unitId')?.valueChanges.subscribe((val) => {
      this.unitId = val;
    });
  }

  // Get dynamic questions form array
  get questionsArr(): FormArray {
    return this.multiQuestionForm.get('questions') as FormArray;
  }

  // Generate Question Controls
  generateQuestionControls() {
    const count = this.questionCountInput || 0;
    while (this.questionsArr.length !== 0) {
      this.questionsArr.removeAt(0);
    }
    for (let i = 0; i < count; i++) {
      this.questionsArr.push(
        this.fb.group({
          text: ['', Validators.required],
          options: ['', [Validators.required, Validators.minLength(3)]],
          correctAnswer: ['', Validators.required],
        })
      );
    }
  }

  // Load units and filter uploaded
  loadUnitsAndContents() {
    this.lmsService.getUnitsByCourse(this.courseId).subscribe({
      next: (units) => {
        this.units = units;
        this.lmsService.getUploadedContentsByCourse(this.courseId).subscribe({
          next: (uploads) => {
            this.uploadedUnitIds = uploads.map(u => u.unitId);
            this.filteredUnits = this.units.filter(u => !this.uploadedUnitIds.includes(u.unitId));
          },
          error: () => { this.filteredUnits = [...this.units]; },
        });
      },
      error: () => { this.errorMessageVideo = 'Failed to load units.'; }
    });
  }

  // Video selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv'];
    const maxSize = 500 * 1024 * 1024;

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        this.errorMessageVideo = 'Only MP4, AVI, MOV, MKV files are allowed.';
        this.selectedFile = null;
        return;
      }
      if (file.size > maxSize) {
        this.errorMessageVideo = 'File size exceeds 500MB.';
        this.selectedFile = null;
        return;
      }
      this.errorMessageVideo = '';
      this.selectedFile = file;
    }
  }

  onSubmitVideo() {
    this.successMessageVideo = '';
    this.errorMessageVideo = '';

    if (!this.selectedFile) {
      this.errorMessageVideo = 'Please select a valid video file.';
      return;
    }
    if (this.contentForm.invalid) {
      this.errorMessageVideo = 'Please fill all required fields correctly.';
      return;
    }

    const durationValue = Math.max(1, Math.round(Number(this.contentForm.value.duration)));
    const formData = new FormData();
    formData.append('file', this.selectedFile!);
    formData.append('duration', durationValue.toString());
    formData.append('unitId', this.contentForm.value.unitId);

    this.lmsService.addUnitContent(formData).subscribe({
      next: () => {
        this.successMessageVideo = 'Video uploaded successfully!';
        const uploadedId = this.contentForm.value.unitId;
        this.filteredUnits = this.filteredUnits.filter(u => u.unitId !== uploadedId);

        setTimeout(() => {
          this.successMessageVideo = '';
          this.contentForm.reset();
          this.selectedFile = null;
          this.unitId = 0;
          this.loadUnitsAndContents();
        }, 2000);
      },
      error: (err) => {
        this.errorMessageVideo = err.error?.message || 'Failed to upload video.';
      }
    });
  }

  // Manual Questions
  submitAllQuestions() {
    this.successMessageQuestion = '';
    this.errorMessageQuestion = '';

    if (this.multiQuestionForm.invalid) {
      this.errorMessageQuestion = 'Please fill all question fields correctly.';
      return;
    }

    const questionsToSubmit = this.questionsArr.controls.map((qCtrl, idx) => {
      const optionsArray = qCtrl.value.options.split(',').map((opt: string) => opt.trim());
      const correctAnswer = qCtrl.value.correctAnswer.trim();

      if (optionsArray.length < 3) throw new Error(`Question #${idx + 1} must have at least 3 options.`);
      if (!optionsArray.includes(correctAnswer)) throw new Error(`Question #${idx + 1}: Correct answer must match one of the options.`);

      return {
        text: qCtrl.value.text.trim(),
        options: JSON.stringify(optionsArray),
        correctAnswer: correctAnswer,
        quizId: this.quizId
      };
    });

    const submissionObservables = questionsToSubmit.map(q => this.lmsService.createQuestion(q));

    let currentIndex = 0;
    const submitNext = () => {
      if (currentIndex < submissionObservables.length) {
        submissionObservables[currentIndex].subscribe({
          next: () => { currentIndex++; submitNext(); },
          error: (err) => { this.errorMessageQuestion = err.error?.message || `Failed question #${currentIndex + 1}`; }
        });
      } else {
        this.successMessageQuestion = 'All questions submitted successfully!';
        this.multiQuestionForm.reset();
        this.questionsArr.clear();
        this.questionCountInput = 0;
        setTimeout(() => this.successMessageQuestion = '', 2000);
      }
    };

    try { submitNext(); } catch (e: any) { console.error(e.message); }
  }

  // JSON Question File
  onQuestionFileSelected(event: any) {
    const file = event.target.files[0];
    const allowedTypes = ['application/json'];
    const maxSize = 10 * 1024 * 1024;

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        this.errorMessageFile = 'Only JSON files are allowed.';
        this.selectedQuestionFile = null;
        return;
      }
      if (file.size > maxSize) {
        this.errorMessageFile = 'File size exceeds 10MB.';
        this.selectedQuestionFile = null;
        return;
      }
      this.errorMessageFile = '';
      this.selectedQuestionFile = file;
    }
  }

  uploadQuestionFile() {
    if (!this.selectedQuestionFile) {
      this.errorMessageFile = 'Please select a JSON file first.';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const questionsArray = JSON.parse(e.target.result);

        const submissionObservables = questionsArray.map((q: any, idx: number) => {
          const optionsArray = q.options.split(',').map((opt: string) => opt.trim());
          return this.lmsService.createQuestion({
            text: q.text.trim(),
            options: JSON.stringify(optionsArray),
            correctAnswer: q.correctAnswer.trim(),
            quizId: this.quizId
          });
        });

        let currentIndex = 0;
        const submitNext = () => {
          if (currentIndex < submissionObservables.length) {
            submissionObservables[currentIndex].subscribe({
              next: () => { currentIndex++; submitNext(); },
              error: (err:any) => { this.errorMessageFile = err.error?.message || `Failed question #${currentIndex + 1}`; }
            });
          } else {
            this.successMessageFile = 'All questions uploaded successfully!';
            this.selectedQuestionFile = null;
            setTimeout(() => this.successMessageFile = '', 3000);
          }
        };

        submitNext();
      } catch (err: any) {
        this.errorMessageFile = 'Invalid JSON file format.';
      }
    };

    reader.readAsText(this.selectedQuestionFile);
  }

  goToNextStep() {
    this.router.navigate(['instructor-dashboard/mycourse']);
  }
}
