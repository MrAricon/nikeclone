import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://paucano.ddns.net/nikecloneapi/api.php';
  private authState = new BehaviorSubject<boolean>(false);
  private jwtHelper = new JwtHelperService();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.authState.next(this.isAuthenticated());
    }
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}?login`, { email, password }).pipe(
      tap(response => {
        const decodedToken = this.jwtHelper.decodeToken(response.token);
        let roles: string = "guest";
  
        let rolesArr: any[] = [];
  
        rolesArr = Object.values(decodedToken.roles);
  
        if (rolesArr.length > 0) {
          roles = rolesArr.join(", ");
        }
  
        sessionStorage.setItem("sessionToken", response.token);
        sessionStorage.setItem("userRoles", roles);
        this.authState.next(true);
      })
    );
  }

  register(username: string, password: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}?register`, { username, password, email });
  }

  logout(): void {
    if (this.isBrowser) {
      this.document.cookie = 'authToken=; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      sessionStorage.removeItem('userRole');
      this.authState.next(false);
    }
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getRoles(): string | null {
    return this.isBrowser ? sessionStorage.getItem('userRoles') : null;
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  getToken(): string | null {
    return this.isBrowser ? sessionStorage.getItem('sessionToken') : null;
  }
}
