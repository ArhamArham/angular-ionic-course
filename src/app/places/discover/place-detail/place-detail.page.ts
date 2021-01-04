import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {NewBookingComponent} from '../../../bookings/new-booking/new-booking.component';
import {PlacesService} from '../../places.service';
import {ActivatedRoute} from '@angular/router';
import {Place} from '../../place.model';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

    place: Place;
    private placeSub: Subscription;

    constructor(
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private placesService: PlacesService,
        private route: ActivatedRoute,
        private actionSheetCtrl: ActionSheetController
    ) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/offers').then();
                return;
            }
            this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
                this.place = place;
            });
        });
    }

    onBookPlace() {
        this.actionSheetCtrl.create({
            header: 'Choose an Action',
            buttons: [
                {
                    text: 'Select Date',
                    handler: () => this.openBookingModel('current')
                },
                {
                    text: 'Select Random',
                    handler: () => this.openBookingModel('random')
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        }).then(actionSheetEl => {
            actionSheetEl.present().then();
        });

    }

    openBookingModel(mode: 'current' | 'random') {
        this.modalCtrl.create({
            component: NewBookingComponent,
            componentProps: {selectedPlace: this.place, selectedMode: mode}
        }).then(modelEl => {
            modelEl.present().then();
            return modelEl.onDidDismiss();
        }).then(resultData => {
            console.log(resultData.data, resultData.role);
            if (resultData.role === 'confirm') {
                console.log('booked');
            }
        });
    }

    ngOnDestroy() {
        if (this.placeSub) {
            this.placeSub.unsubscribe();
        }
    }

}
