import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {NewBookingComponent} from '../../../bookings/new-booking/new-booking.component';
import {PlacesService} from '../../places.service';
import {ActivatedRoute} from '@angular/router';
import {Place} from '../../place.model';

@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

    place: Place;

    constructor(
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private placesService: PlacesService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/offers').then();
                return;
            }
            this.place = this.placesService.getPlace(paramMap.get('placeId'));
        });
    }

    onBookPlace() {
        this.modalCtrl.create({
            component: NewBookingComponent,
            componentProps: {selectedPlace: this.place}
        }).then(modelEl => {
            modelEl.present();
            return modelEl.onDidDismiss();
        }).then(resultData => {
            console.log(resultData.data, resultData.role);
            if (resultData.role === 'confirm') {
                console.log('booked');
            }
        });
    }

}
