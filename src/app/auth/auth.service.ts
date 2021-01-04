import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private isAuthenticated$ = true;
    private userId$ = 'arham';

    constructor() {
    }

    get userIsAuthenticated() {
        return this.isAuthenticated$;
    }

    get userId() {
        return this.userId$;
    }

    login() {
        this.isAuthenticated$ = true;
    }

    logout() {
        this.isAuthenticated$ = false;
    }
}
