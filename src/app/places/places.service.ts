import {Injectable} from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {delay, map, take, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    // tslint:disable-next-line:variable-name
    private _places = new BehaviorSubject<Place[]>([
        new Place(
            '1',
            'new town',
            'hello this is from new town this is very good place',
            'https://images.unsplash.com/photo-1602526211878-5a18d013bc58?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1011&q=80',
            200,
            new Date('2020-01-01'),
            new Date('2021-01-03'),
            'arham1'
        ),
        new Place(
            '2',
            'China Clark',
            'hello this is from new town this is very good place',
            'https://images.unsplash.com/photo-1585996958204-f293ebbe4abe?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=632&q=80',
            311,
            new Date('2020-01-01'),
            new Date('2021-01-03'),
            'arham'
        ),
        new Place(
            '3',
            'Boston',
            'hello this is from new town this is very good place',
            'https://images.unsplash.com/photo-1608915214654-cb4961d906b7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
            311,
            new Date('2020-01-01'),
            new Date('2021-01-03'),
            'arham'
        ),
    ]);

    get places() {
        return this._places.asObservable();
    }

    constructor(private authService: AuthService) {
    }

    getPlace(id: string) {
        return this.places.pipe(take(1), map(places => {
            return {...places.find(p => p.id === id)};
        }));
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
        return this.places.pipe(take(1), delay(1000), tap(places => {
            this._places.next(places.concat(place));
        }));
    }

    updatePlace(id, title, description) {
        return this.places.pipe(
            take(1),
            delay(1000),
            tap(places => {
                const updatedPlaceIndex = places.findIndex(p => p.id === id);
                const updatedPlaces = [...places];
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
                this._places.next(updatedPlaces);
            }));
    }
}
