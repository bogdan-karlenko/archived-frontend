import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from './../../environments/environment';

@Injectable()
export class RegisterService {

    constructor(
        private http: HttpClient
    ) { }


    validate(code) {
        return this.http.post(`${environment.apiUrl}/register/validate/`, { data: code });
    }

    sendMail(email) {
        this.http.post(`${environment.apiUrl}/register/email/`, { email: email }).subscribe();
    }

    createUser(code, form) {
        const data = {
            code,
            user: {
                username: form.email,
                password: form.password ? form.password : undefined,
                facebook_id: form.facebook ? form.facebook : undefined,
                google_id: form.google ? form.google : undefined
            }
        };
        return this.http.post(`${environment.apiUrl}/register`, data);
    }
}
