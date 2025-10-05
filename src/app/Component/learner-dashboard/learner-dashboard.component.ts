import {  CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-learner-dashboard',
  imports: [RouterOutlet,NgClass,CommonModule],
  templateUrl: './learner-dashboard.component.html',
  styleUrl: './learner-dashboard.component.css'
})
export class LearnerDashboardComponent {
constructor(private router: Router) { }
  isDropdownOpen = false;
  userPanelOpen: boolean = false;
  ownerPanelOpen: boolean = false;
  isSidebarOpen: boolean = false;

  private elementRef = inject(ElementRef); // required for click outside detection

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('Role');
    sessionStorage.removeItem('userId');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }


  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedInsideSidebar = this.elementRef.nativeElement.querySelector('#sidebar')?.contains(event.target);
    const clickedToggleButton = this.elementRef.nativeElement.querySelector('#toggleSidebarBtn')?.contains(event.target);

    if (!clickedInsideSidebar && !clickedToggleButton) {
      this.isSidebarOpen = false;
    }
  }
}

