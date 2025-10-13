import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LmsservicesService } from '../../../../services/lmsservices.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-start-learning',
  imports: [CommonModule],
  templateUrl: './start-learning.component.html',
  styleUrl: './start-learning.component.css'
})
export class StartLearningComponent implements OnInit {

  courseId!: number;
  course: any = null;
  isLoading = false;
  errorMessage = '';

  selectedUnit: any = null;
  selectedContent: any = null;

  unitProgress: Array<{ unitId: number; progressPercent: number; isCompleted?: boolean }> = [];
  activeUnitId!: number;

  videoProgress: number = 0;
  selectedUnitCompleted = false;
  unitCompleteMessage = '';
  courseProgressPercent = 0;
  lastTime = 0;

  constructor(
    private route: ActivatedRoute,
    private service: LmsservicesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));

    if (!this.courseId || isNaN(this.courseId)) {
      this.errorMessage = 'Invalid Course ID';
      return;
    }

    this.loadCourse();
  }

  // Load course and its units
  loadCourse() {
    this.isLoading = true;
    this.service.getLearnerCourseByIdfor(this.courseId).subscribe({
      next: (res) => {
        this.course = res;
        this.isLoading = false;

        // Guard: ensure units exists
        if (this.course?.units?.length) {
          this.loadProgress(() => {
            const firstUnit = this.course.units[0];
            if (firstUnit) {
              this.selectUnit(firstUnit);
            }
          });
        } else {
          this.unitCompleteMessage = 'No units available for this course.';
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.message || 'Failed to load course.';
        this.isLoading = false;
      }
    });
  }

  // Load unit progress from backend (expects unitProgress array or aggregate fallback)
  loadProgress(callback?: () => void) {
    this.service.getCourseProgress(this.courseId).subscribe({
      next: (res) => {
        // overall percent if present
        this.courseProgressPercent = res?.progressPercent ?? this.courseProgressPercent;

        // Preferred: backend returns per-unit progress array `unitProgress`
        if (res?.unitProgress && Array.isArray(res.unitProgress)) {
          this.unitProgress = res.unitProgress.map((p: any) => ({
            unitId: p.unitId,
            progressPercent: p.progressPercent ?? (p.isCompleted ? 100 : 0),
            isCompleted: !!p.isCompleted
          }));
        } else if (res?.totalUnits !== undefined && this.course?.units) {
          // fallback: distribute aggregate percent (best-effort)
          const totalUnits = res.totalUnits || this.course.units.length;
          const completedUnits = res.completedUnits || 0;
          const percentPerCompleted = totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0;

          this.unitProgress = this.course.units.map((u: any, i: number) => ({
            unitId: u.unitId,
            progressPercent: u ? (i < completedUnits ? 100 : 0) : 0,
            isCompleted: i < completedUnits
          }));

          // ensure overall percent set
          this.courseProgressPercent = res.progressPercent ?? Math.floor((completedUnits * 100) / Math.max(totalUnits, 1));
        } else {
          this.unitProgress = (this.course?.units || []).map((u: any) => ({
            unitId: u.unitId,
            progressPercent: 0,
            isCompleted: false
          }));
        }
        if (callback) callback();
      },
      error: (err) => {
        console.warn(' [loadProgress] Failed:', err);
        this.unitProgress = (this.course?.units || []).map((u: any) => ({
          unitId: u.unitId,
          progressPercent: 0,
          isCompleted: false
        }));
        if (callback) callback();
      }
    });
  }

  // Check if unit is completed
  isUnitCompleted(unitId: number): boolean {
    const unit = this.unitProgress.find((p) => p.unitId === unitId);
    return !!unit && (unit.isCompleted || (unit.progressPercent ?? 0) >= 100);
  }

  // Lock next unit until previous unit = 100%
  isUnitLocked(unit: any): boolean {
    if (!this.course?.units?.length) return true;

    const index = this.course.units.findIndex((u: any) => u.unitId === unit.unitId);
    if (index <= 0) return false;

    const prevUnitId = this.course.units[index - 1]?.unitId;
    const prevUnitProgress = this.unitProgress.find((p) => p.unitId === prevUnitId);

    return !prevUnitProgress || (prevUnitProgress.progressPercent ?? 0) < 100;
  }

  // Select unit (if unlocked)
  selectUnit(unit: any) {
    if (!unit) return;

    if (this.isUnitLocked(unit)) {
      this.showMessage(' Complete previous unit fully (100%) to unlock this one.');
      return;
    }

    this.selectedUnit = unit;
    this.selectedContent = unit?.contents && unit.contents.length ? unit.contents[0] : null;
    this.activeUnitId = unit.unitId;
    this.videoProgress = this.getUnitProgressPercent(unit.unitId);
    this.selectedUnitCompleted = this.isUnitCompleted(unit.unitId);


    // call startUnit but don't block UI on it
    this.service.startUnit(this.courseId, unit.unitId).subscribe({
      next: () => console.log(' Unit started:'),
      error: (err) => console.error(' Start unit error:', err)
    });
  }




  // Update progress while watching direct skip the video time
  onTimeUpdate(event: Event) {
    const video = event.target as HTMLVideoElement;
    if (!video || !video.duration) return;

    const rawPercent = (video.currentTime / video.duration) * 100;
    const progress = Math.min(100, Math.max(0, Math.floor(rawPercent)));
    this.videoProgress = progress;

    if (this.selectedUnit?.unitId != null) {
      this.updateUnitProgress(this.selectedUnit.unitId, progress);
    }

    // Auto-complete when near 100%
    if (progress >= 98 && !this.selectedUnitCompleted) {
      this.completeUnit();
      this.selectedUnitCompleted = true;
    }
  }

// learner not skip and seeking the video
//   onTimeUpdate(event: Event) {
//   const video = event.target as HTMLVideoElement;
//   if (!video || !video.duration) return;

//   // if (video.playbackRate !== 1) {
//   //   video.playbackRate = 1;
//   // }

//   if (Math.abs(video.currentTime - (this.lastTime || 0)) > 2) {
//     video.currentTime = this.lastTime || 0;
//     this.showMessage('Skipping is disabled! Watch full video to complete.');
//     return;
//   }
//   const rawPercent = (video.currentTime / video.duration) * 100;
//   const progress = Math.min(100, Math.max(0, Math.floor(rawPercent)));
//   this.videoProgress = progress;
//   if (this.selectedUnit?.unitId != null) {
//     this.updateUnitProgress(this.selectedUnit.unitId, progress);
//   }
//   if (progress >= 98 && !this.selectedUnitCompleted) {
//     this.completeUnit();
//     this.selectedUnitCompleted = true;
//   }
//   this.lastTime = video.currentTime;
// }

// it is show on the ui side 
// onSeeking(event: Event) {
//   const video = event.target as HTMLVideoElement;
//   if (video.currentTime > this.lastTime + 2) {
//     // Stop user from skipping ahead
//     video.currentTime = this.lastTime;
//     this.showMessage("Skipping not allowed. Please watch the video fully!");
//   }
// }



  // Update local progress array
  updateUnitProgress(unitId: number, progress: number) {
    const idx = this.unitProgress.findIndex((u) => u.unitId === unitId);
    if (idx !== -1) {
      this.unitProgress[idx].progressPercent = progress;
      if (progress >= 100) this.unitProgress[idx].isCompleted = true;
    } else {
      this.unitProgress.push({ unitId, progressPercent: progress, isCompleted: progress >= 100 });
    }
  }

  // Complete unit (call backend)
  completeUnit() {
    if (!this.selectedUnit) return;

    this.service.completeUnit(this.courseId, this.selectedUnit.unitId).subscribe({
      next: () => {
        this.selectedUnitCompleted = true;
        this.updateUnitProgress(this.selectedUnit.unitId, 100);
        this.showMessage('Unit completed successfully!');
        this.refreshUnlocks();
      },
      error: (err) => {
        console.error(' Complete unit error:', err);
        // Optionally show error to user
        this.showMessage('Failed to mark unit complete. Please try again.');
      }
    });
  }

  // Refresh progress unlocks
  refreshUnlocks() {
    // small delay to allow DB to persist
    setTimeout(() => {
      this.loadProgress(() => {
        console.log(' Progress refreshed after completion');
      });
    }, 800);
  }

  // Get progress % for a unit
  getUnitProgressPercent(unitId: number): number {
    const unit = this.unitProgress.find((u) => u.unitId === unitId);
    return unit ? Math.floor(unit.progressPercent || 0) : 0;
  }

  // Check if all units completed
  allUnitsCompleted(): boolean {
    const units = this.course?.units || [];
    if (!units.length) return false;
    return units.every((u: any) => this.isUnitCompleted(u.unitId));
  }

  // Navigate to quiz (only when all units completed)
  quizClick(quizId: number) {
    if (!this.allUnitsCompleted()) {
      this.showMessage(' Complete all units first to unlock the quiz.');
      return;
    }
    this.router.navigate(['/learner-dashboard/quiz', this.courseId, quizId]);
  }

  // Show temp message
  showMessage(message: string) {
    this.unitCompleteMessage = message;
    setTimeout(() => (this.unitCompleteMessage = ''), 3000);
  }

  // Calculate overall course progress %
  getOverallProgress(): number {
    if (!this.course?.units?.length || !this.unitProgress?.length) return 0;

    const totalUnits = this.course.units.length;
    let totalProgress = 0;

    this.course.units.forEach((unit: any) => {
      const progressObj = this.unitProgress.find(u => u.unitId === unit.unitId);
      totalProgress += progressObj ? progressObj.progressPercent : 0;
    });

    return totalProgress / totalUnits;
  }
}