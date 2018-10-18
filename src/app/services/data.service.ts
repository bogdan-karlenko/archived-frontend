import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from './../../environments/environment';
import { IProvider } from './../interfaces';

@Injectable()
export class DataService {

    constructor(
        private http: HttpClient
    ) { }

    getProviders(query?: String): Observable<IProvider[]> {
        return this.http.get<IProvider[]>(`${environment.apiUrl}/Provider${query ? '?' + query : ''}`);
    }

    getDevices(): Observable<String[]> {
        return this.http.get<String[]>(`${environment.apiUrl}/devices`);
    }
}
