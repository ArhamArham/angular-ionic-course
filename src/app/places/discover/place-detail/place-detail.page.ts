import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionSheetController, LoadingController, ModalController, NavController} from '@ionic/angular';
import {NewBookingComponent} from '../../../bookings/new-booking/new-booking.component';
import {PlacesService} from '../../places.service';
import {ActivatedRoute} from '@angular/router';
import {Place} from '../../place.model';
import {Subscription} from 'rxjs';
import {BookingService} from '../../../bookings/booking.service';
import {AuthService} from '../../../auth/auth.service';
import {MapModalComponent} from '../../../shared/map-modal/map-modal.component';

@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

    place: Place;
    private placeSub: Subscription;
    private isBooked = false;
    isLoading = false;

    constructor(
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private placesService: PlacesService,
        private bookingService: BookingService,
        private authService: AuthService,
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
            this.isLoading = true;
            this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
                this.place = place;
                this.isBooked = place.userId !== this.authService.userId;
                this.isLoading = false;
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
            if (resultData.role === 'confirm') {
                this.loadingCtrl.create({message: 'Booking place...'})
                    .then(loadingEl => {
                        loadingEl.present().then();
                        const data = resultData.data.bookingData;
                        this.bookingService.addBooking(
                            this.place.id,
                            this.place.title,
                            this.place.imageUrl,
                            data.firstName,
                            data.lastName,
                            data.guestNumber,
                            data.startDate,
                            data.endDate
                        ).subscribe(() => loadingEl.dismiss().then());
                    });
            }
        });
    }

    onShowFullMap() {
        this.modalCtrl.create({
            component: MapModalComponent,
            componentProps: {
                center: {
                    lat: this.place.location.lat,
                    lng: this.place.location.lng
                },
                selectable: false,
                closeButtonText: 'Close',
                title: this.place.location.address
            }
        }).then(modelEl => {
            modelEl.present().then();
        });
    }

    ngOnDestroy() {
        if (this.placeSub) {
            this.placeSub.unsubscribe();
        }
    }

}
