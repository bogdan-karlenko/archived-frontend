import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from './../../environments/environment';
import { IUserProfile } from './../core/interfaces';

@Injectable()
export class UserService {

    public isAuthentificated = false;

    constructor(
        private http: HttpClient
    ) { }

    setUserProfile(user: IUserProfile): Observable<IUserProfile> {
        return this.http.post<IUserProfile>(`${environment.apiUrl}/user`, user);
    }

    getUserProfile(id: string): Observable<IUserProfile> {
        return this.http.get<IUserProfile>(`${environment.apiUrl}/user`, { params: { id } });
    }
}
