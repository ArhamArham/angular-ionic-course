import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {MapModalComponent} from '../../map-modal/map-modal.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
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
        private http: HttpClient
    ) {
    }

    ngOnInit() {
    }

    onPickLocation() {
        this.modalCtrl.create({
            component: MapModalComponent
        }).then(modelEl => {
            modelEl.onDidDismiss()
                .then(modalData => {
                    if (!modalData) {
                        return;
                    }
                    const {lat, lng} = modalData.data;
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
                });
            modelEl.present().then();
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
                }));
    }
}
