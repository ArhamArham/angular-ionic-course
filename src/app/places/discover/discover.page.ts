import {Component, OnInit} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';

@Component({
    selector: 'app-discover',
    templateUrl: './discover.page.html',
    styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

    loadedPlaces: Place[];
    listedLoadedPlaces: Place[];

    constructor(private placesService: PlacesService) {
    }

    ngOnInit() {
        this.loadedPlaces = this.placesService.places;
        this.listedLoadedPlaces = this.placesService.places;
    }

    onFilterUpdate(event: any) {
        console.log(event.detail);
    }
}
