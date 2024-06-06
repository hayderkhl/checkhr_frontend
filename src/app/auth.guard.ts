import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const token: any = localStorage.getItem('token');
    console.log(token);

    // Get the current pathname
    const pathname = state.url;
    console.log('Pathname:', pathname);

    // Allow access to forgot-password and reset-password routes even if not authenticated
    if (
      pathname.includes('forgot-password') ||
      pathname.includes('reset-password')
    ) {
      return true;
    }

    if (token) {
      console.log('user is auth');
      return true; // Allow access if the user is authenticated
    } else {
      // Redirect to the login page if the user is not authenticated
      console.log('user is not auth');
      // this.router.navigate(['/login']);
      return false;
    }
  }
}
