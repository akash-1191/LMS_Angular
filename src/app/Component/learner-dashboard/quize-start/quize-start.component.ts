import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-quize-start',
  imports: [CommonModule],
  templateUrl: './quize-start.component.html',
  styleUrl: './quize-start.component.css'
})
export class QuizeStartComponent implements OnInit {

  courseId!: number;
  quizId!: number;
  quiz: any = null;
  courseTitle: string = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showCertificate = false;

  quizAnswers: { [key: number]: string } = {};
  quizScore = 0;
  quizSubmitted = false;
  quizTimeLeft = 0;
  quizInterval: any;
  currentQuestionIndex = 0;

  @ViewChild('certificateEl') certificateEl!: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private service: LmsservicesService
  ) { }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));

    if (!this.courseId || !this.quizId) {
      this.errorMessage = 'Invalid Course or Quiz ID';
      return;
    }

    this.checkIfAlreadyAttempted();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    if (this.quizInterval) clearInterval(this.quizInterval);
  }

  private getUserIdFromToken(): number | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // common claim names
      return payload.UserId || payload.userId || payload.sub || null;
    } catch {
      return null;
    }
  }

  private handleVisibilityChange = () => {
    if (document.hidden && !this.quizSubmitted) {
      this.submitQuiz();
    }
  };

  private handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!this.quizSubmitted) {
      this.submitQuiz();
      event.preventDefault();
      event.returnValue = '';
    }
  };

  checkIfAlreadyAttempted() {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      this.errorMessage = 'User not authenticated. Please log in again.';
      return;
    }

    this.service.checkQuizAttempt(userId, this.courseId, this.quizId).subscribe({
      next: (res) => {
        if (res?.alreadyAttempted) {
          this.fetchPreviousAttempt(userId);
        } else {
          this.loadQuiz();
        }
      },
      error: (err) => {
        console.warn('Attempt check failed:', err);
        this.loadQuiz(); // fallback
      }
    });
  }

  fetchPreviousAttempt(userId: number) {
    this.service.getUserAttempts(userId).subscribe({
      next: (attempts) => {
        const attempt = attempts.find((a: any) =>
          a.courseId === this.courseId && a.quizId === this.quizId
        );
        if (attempt) {
          this.quizSubmitted = true;
          this.quizScore = attempt.score;
          this.quiz = {
            questions: new Array(attempt.totalMarks),
            title: attempt.quizTitle || 'Previously Attempted Quiz'
          };
          this.courseTitle = attempt.coursename || 'Course Title Not Found';  // Set course title here
          this.successMessage = 'You have already attempted this quiz.';
        } else {
          this.errorMessage = 'Quiz attempt data not found.';
        }
      },
      error: (err) => {
        console.error('Failed to load previous attempt:', err);
        this.errorMessage = 'Could not load previous attempt.';
      }
    });
  }


  loadQuiz() {
    this.isLoading = true;
    this.service.getQuizByCourse(this.courseId, this.quizId).subscribe({
      next: (res) => {
        this.quiz = res;
        this.courseTitle = res.courseName || ''; // Assuming backend sends courseName here as well
        if (!this.quiz?.questions?.length) {
          this.errorMessage = 'No questions found for this quiz.';
          this.isLoading = false;
          return;
        }
        this.quizTimeLeft = (this.quiz.duration || 1) * 60;
        this.isLoading = false;
        this.startTimer();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Failed to load quiz';
        this.isLoading = false;
      }
    });
  }

  startTimer() {
    if (this.quizInterval) clearInterval(this.quizInterval);
    this.quizInterval = setInterval(() => {
      this.quizTimeLeft--;
      if (this.quizTimeLeft <= 0) {
        this.submitQuiz();
      }
    }, 1000);
  }

  selectAnswer(questionId: number, answer: string) {
    this.quizAnswers[questionId] = answer;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz() {
    if (this.quizInterval) clearInterval(this.quizInterval);
    if (this.quizSubmitted) return;

    this.quizSubmitted = true;
    this.quizScore = 0;

    this.quiz.questions.forEach((q: any) => {
      if (this.quizAnswers[q.questionId]?.trim() === q.correctAnswer?.trim()) {
        this.quizScore++;
      }
    });

    const totalMarks = this.quiz.questions.length;
    const passingScore = Math.ceil(totalMarks * 0.5);
    const isPassed = this.quizScore >= passingScore;

    const userId = this.getUserIdFromToken();
    if (!userId) {
      this.errorMessage = 'User not authenticated.';
      return;
    }

    const attemptData = {
      userId: userId,
      courseId: this.courseId,
      quizId: this.quizId,
      score: this.quizScore,
      totalMarks: totalMarks,
      isPassed: isPassed
    };

    this.service.submitQuizAttempt(attemptData).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Quiz submitted successfully!';
      },
      error: (err) => {
        console.error('Error saving quiz:', err);
        if (err.error?.message?.includes('already attempted')) {
          this.errorMessage = 'You have already attempted this quiz.';
        } else {
          this.errorMessage = 'Error submitting quiz.';
        }
      }
    });
  }

  // ---------- Certificate generation ----------


async downloadCertificate() {
  if (!this.certificateEl) {
    console.error('Certificate element not found');
    this.errorMessage = 'Certificate element not found';
    return;
  }

  // Show the hidden element
  this.showCertificate = true;

  // Wait for DOM to render fully
  await new Promise(resolve => setTimeout(resolve, 300));

  const element: HTMLElement = this.certificateEl.nativeElement;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff', // Set background to white to avoid transparency
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = imgData;
    a.download = `certificate_${this.getCertificateFilename()}.png`;
    a.click();

    this.successMessage = 'Certificate downloaded successfully!';
  } catch (err) {
    console.error('Certificate generation failed:', err);
    this.errorMessage = 'Could not generate certificate.';
  } finally {
    this.showCertificate = false;
  }
}


  public getCertificateFilename(): string {
    const userId = this.getUserIdFromToken() || 'user';
    const nameSafe = (this.getUserNameFromToken() || 'learner').replace(/\s+/g, '_');
    const date = new Date().toISOString().slice(0, 10);
    return `${nameSafe}_${this.courseId}_${date}`;
  }

  public getUserNameFromToken(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.fullName || payload.name || payload.username || null;
    } catch {
      return null;
    }
  }

  // helpers for template display
  get currentQuestion() {
    return this.quiz ? this.quiz.questions[this.currentQuestionIndex] : null;
  }

  get formattedTimeLeft(): string {
    const minutes = Math.floor(this.quizTimeLeft / 60);
    const seconds = this.quizTimeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  getFormattedDate(): string {
    return new Date().toLocaleDateString();
  }
}