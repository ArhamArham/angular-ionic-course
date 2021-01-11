import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Capacitor, Plugins} from '@capacitor/core';
import {MapModalComponent} from '../../map-modal/map-modal.component';
import {PlaceLocation} from '../../../places/location.model';

const MAP_API_KEY = environment.googleMapsAPIKey;

@Component({
    selector: 'app-location-picker',
    templateUrl: './location-picker.component.html',
    styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

    @Output() locationPick = new EventEmitter<PlaceLocation>();
    address: string;
    isLoading = false;

    constructor(
        private modalCtrl: ModalController,
        private http: HttpClient,
        private actionSheetCtrl: ActionSheetController,
        private alertCtrl: AlertController
    ) {
    }

    ngOnInit() {
    }

    onPickLocation() {
        this.actionSheetCtrl.create({
            header: 'Please choose',
            buttons: [
                {
                    text: 'Auto-Locate',
                    handler: () => {
                        this.autoLocate();
                    }
                },
                {
                    text: 'Pick on map',
                    handler: () => {
                        this.openMap();
                    }
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

    private autoLocate() {
        if (!Capacitor.isPluginAvailable('Geolocation')) {
            this.showAlertError();
            return;
        }
        this.isLoading = true;
        Plugins.Geolocation.getCurrentPosition()
            .then(geoPosition => {
                const {latitude, longitude} = geoPosition.coords;
                this.createAddress(latitude, longitude);
                this.isLoading = false;
            })
            .catch(err => {
                this.showAlertError();
            });
    }

    private openMap() {
        this.modalCtrl.create({
            component: MapModalComponent
        }).then(modelEl => {
            modelEl.onDidDismiss()
                .then(modalData => {
                    if (!modalData.data) {
                        return;
                    }
                    const {lat, lng} = modalData.data;
                    this.createAddress(lat, lng);
                });
            modelEl.present().then();
        });
    }

    private createAddress(lat, lng) {
        const pickedLocation: PlaceLocation = {
            lat, lng, address: null
        };
        this.isLoading = true;
        this.getAddress(lat, lng)
            .subscribe((address) => {
                this.address = address;
                pickedLocation.address = address;
                this.isLoading = false;
                this.locationPick.emit(pickedLocation);
            });
    }

    private getAddress(lat: number, lng: number) {
        return this.http.get<any>
        (`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_API_KEY}`)
            .pipe(
                map(geoData => {
                    if (!geoData || !geoData.results || geoData.results.length === 0) {
                        return null;
                    }
                    return geoData.results[0].formatted_address;
                })
            );
    }


    private showAlertError() {
        this.alertCtrl.create({
            header: 'Could not fetch location',
            message: 'Please use map to pick location!',
            buttons: ['Okay']
        }).then(alertEl => alertEl.present().then());
    }
}
