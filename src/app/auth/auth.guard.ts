import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);

  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('role');
  const expectedRole = route.data['expectedRole'];

  if (token && userRole === expectedRole) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
