import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from './../../environments/environment';
import { ILocalCredentials, ILoginResponse, ISocialCredentials, IUserProfile } from './../core/interfaces';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

    public isAuthentificated = false;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    authenticateLocal(credentials: ILocalCredentials): Observable<ILoginResponse> {
        return this.http.post<ILoginResponse>(`${environment.apiUrl}/login`,
            { username: credentials.email, password: credentials.password });
    }

    authenticateSocial(credentials: ISocialCredentials): Observable<ILoginResponse> {
        return this.http.post<ILoginResponse>(`${environment.apiUrl}/login/${credentials.provider}`,
            { id: credentials.id, token: credentials.provider === 'google' ? credentials.idToken : credentials.token });
    }

    setAuthInfo(data: ILoginResponse): void {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        this.isAuthentificated = true;
    }

    getAuthInfo() {
        const string = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (string && token) {
            const user = JSON.parse(string) as { username: string; id: string; };
            if (user.username && user.id) {
                this.isAuthentificated = true;
                return user;
            } else {
                this.logout();
            }
        } else {
            this.logout();
        }
    }

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.isAuthentificated = false;
        this.router.navigate(['login']);
    }
}
