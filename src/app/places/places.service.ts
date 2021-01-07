import {Injectable} from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject, of} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

interface PlaceData {
    dateFrom: string;
    dateTo: string;
    description: string;
    imageUrl: string;
    price: number;
    title: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})

export class PlacesService {
    // tslint:disable-next-line:variable-name
    private _places = new BehaviorSubject<Place[]>([]);

    get places() {
        return this._places.asObservable();
    }

    constructor(
        private authService: AuthService,
        private http: HttpClient
    ) {
    }

    getPlace(id: string) {
        return this.http.get<PlaceData>
        (`https://angular-ionic-course-49d8b-default-rtdb.firebaseio.com/offered-places/${id}.json`)
            .pipe(
                map(placeData => {
                    return new Place(
                        id,
                        placeData.title,
                        placeData.description,
                        placeData.imageUrl,
                        placeData.price,
                        new Date(placeData.dateFrom),
                        new Date(placeData.dateTo),
                        placeData.userId
                    );
                })
            );
    }

    fetchPlaces() {
        return this.http.get<{ [key: string]: PlaceData }>
        ('https://angular-ionic-course-49d8b-default-rtdb.firebaseio.com/offered-places.json')
            .pipe(
                map(resData => {
                    const places = [];
                    for (const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            places.push(
                                new Place(
                                    key,
                                    resData[key].title,
                                    resData[key].description,
                                    resData[key].imageUrl,
                                    resData[key].price,
                                    new Date(resData[key].dateFrom),
                                    new Date(resData[key].dateTo),
                                    resData[key].userId
                                )
                            );
                        }
                    }
                    return places;
                }),
                tap(places => {
                    this._places.next(places);
                })
            );
    }

    addPlace(title, description, price, dateFrom, dateTo) {
        const place = new Place(
            Math.random().toString(),
            title,
            description,
            'https://images.unsplash.com/photo-1608915214654-cb4961d906b7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
            price,
            dateFrom,
            dateTo,
            this.authService.userId
        );
        let generatedId;

        return this.http
            .post<{ name: string }>
            ('https://angular-ionic-course-49d8b-default-rtdb.firebaseio.com/offered-places.json',
                {...place, id: null}
            ).pipe(
                switchMap(resData => {
                    generatedId = resData.name;
                    return this.places;
                }),
                take(1),
                tap(places => {
                    place.id = generatedId;
                    this._places.next(places.concat(place));
                })
            );
    }

    updatePlace(id, title, description) {
        let updatedPlaces: Place[];
        return this.places
            .pipe(
                take(1),
                switchMap(places => {
                    if (!places || places.length <= 0) {
                        return this.fetchPlaces();
                    } else {
                        return of(places);
                    }
                }),
                switchMap(places => {
                    const updatedPlaceIndex = places.findIndex(p => p.id === id);
                    updatedPlaces = [...places];
                    const oldPlace = updatedPlaces[updatedPlaceIndex];
                    updatedPlaces[updatedPlaceIndex] = new Place(
                        oldPlace.id,
                        title,
                        description,
                        oldPlace.imageUrl,
                        oldPlace.price,
                        oldPlace.dateFrom,
                        oldPlace.dateTo,
                        oldPlace.userId
                    );
                    return this.http
                        .put(`https://angular-ionic-course-49d8b-default-rtdb.firebaseio.com/offered-places/${id}.json`,
                            {...updatedPlaces[updatedPlaceIndex], id: null}
                        );

                }),
                tap(() => {
                    this._places.next(updatedPlaces);
                })
            );
    }
}
