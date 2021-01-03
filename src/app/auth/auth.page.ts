import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private loadingCtrl: LoadingController
    ) {
    }

    ngOnInit() {
    }

    onLogin() {
        this.isLoading = true;
        this.authService.login();
        this.loadingCtrl.create({keyboardClose: false, message: 'Logging In.....'})
            .then(loadingEl => {
                loadingEl.present().then();
                setTimeout(() => {
                    this.isLoading = false;
                    loadingEl.dismiss().then();
                    this.router.navigateByUrl('/places/tabs/discover').then();
                }, 1500);
            });

    }

    onSubmit(f: NgForm) {
        console.log(f);
    }
}
