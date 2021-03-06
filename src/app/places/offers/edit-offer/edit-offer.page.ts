import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Place} from '../../place.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PlacesService} from '../../places.service';
import {LoadingController, NavController} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-edit-offer',
    templateUrl: './edit-offer.page.html',
    styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
    place: Place;
    private placeSub: Subscription;
    form: FormGroup;
    public placeId: string;
    isLoading = false;

    constructor(
        private placesService: PlacesService,
        private navCtrl: NavController,
        private route: ActivatedRoute,
        private loadingCtrl: LoadingController,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/offers').then();
                return;
            }
            this.isLoading = true;
            this.placeId = paramMap.get('placeId');
            this.placeSub = this.placesService
                .getPlace(paramMap.get('placeId'))
                .subscribe(place => {
                    this.place = place;
                    this.form = new FormGroup({
                        title: new FormControl(this.place.title, {
                            updateOn: 'blur',
                            validators: [Validators.required]
                        }),
                        description: new FormControl(this.place.description, {
                            updateOn: 'blur',
                            validators: [Validators.required, Validators.maxLength(180)]
                        }),
                    });
                    this.isLoading = false;
                });
        });
    }

    onUpdateOffer() {
        if (!this.form.valid) {
            return;
        }
        this.loadingCtrl.create({message: 'Updating place...'})
            .then(loadingEl => {
                loadingEl.present().then();
                this.placesService
                    .updatePlace(this.place.id, this.form.value.title, this.form.value.description)
                    .subscribe(() => {
                        loadingEl.dismiss().then();
                        this.router.navigate(['places/tabs/offers']).then();
                    });
            });
    }
}
