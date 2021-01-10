import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {environment} from '../../../environments/environment';

const MAP_API_KEY = environment.googleMapsAPIKey;

@Component({
    selector: 'app-map-modal',
    templateUrl: './map-modal.component.html',
    styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('map') mapElementRef: ElementRef;
    @Input() center = {lat: 24.8607343, lng: 67.0011364};
    @Input() selectable = true;
    @Input() closeButtonText = 'cancel';
    @Input() title = 'Pick Location';
    clickListener: any;
    googleMaps: any;

    constructor(
        private modalCtrl: ModalController,
        private rendered: Renderer2
    ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.getGoogleMaps()
            .then(googleMaps => {
                this.googleMaps = googleMaps;
                const mapEl = this.mapElementRef.nativeElement;
                const map = new googleMaps.Map(mapEl, {
                    center: this.center,
                    zoom: 16
                });
                googleMaps.event.addListenerOnce(map, 'idle', () => {
                    this.rendered.addClass(mapEl, 'visible');
                });
                if (this.selectable) {
                    this.clickListener = map.addListener('click', event => {
                        const selectedCords = {
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng()
                        };
                        this.modalCtrl.dismiss(selectedCords).then();
                    });
                } else {
                    const marker = new googleMaps.Marker({
                        position: this.center,
                        map,
                        title: 'Picked Location'
                    });
                    marker.setMap(map);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    onCancel() {
        this.modalCtrl.dismiss().then();
    }

    private getGoogleMaps(): Promise<any> {
        const win = window as any;
        const googleModule = win.google;
        if (googleModule && googleModule.maps) {
            return Promise.resolve(googleModule.maps);
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}`;
            script.async = true;
            script.defer = true;
            document.body.append(script);
            script.onload = () => {
                const loadedGoogleModule = win.google;
                if (loadedGoogleModule && loadedGoogleModule.maps) {
                    resolve(loadedGoogleModule.maps);
                } else {
                    reject('Google map sdk not available.');
                }
            };
        });
    }

    ngOnDestroy() {
        if (this.selectable) {
            this.googleMaps.event.removeListener(this.clickListener);
        }
    }
}
