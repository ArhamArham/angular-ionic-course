import {Injectable} from '@angular/core';
import {Place} from './place.model';

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    // tslint:disable-next-line:variable-name
    private _places: Place[] = [
        new Place(
            '1',
            'new town',
            'hello this is from new town this is very good place',
            'https://images.unsplash.com/photo-1602526211878-5a18d013bc58?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1011&q=80',
            200,
            new Date('2020-01-01'),
            new Date('2021-01-03')
        ),
        new Place(
            '2',
            'China Clark',
            'hello this is from new town this is very good place',
            'https://images.unsplash.com/photo-1585996958204-f293ebbe4abe?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=632&q=80',
            311,
            new Date('2020-01-01'),
            new Date('2021-01-03')
        ),
        new Place(
            '3',
            'Boston',
            'hello this is from new town this is very good place',
            'https://images.unsplash.com/photo-1608915214654-cb4961d906b7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
            311,
            new Date('2020-01-01'),
            new Date('2021-01-03')
        ),
    ];

    get places() {
        return [...this._places];
    }

    constructor() {
    }

    getPlace(id: string) {
        return {...this._places.find(p => p.id === id)};
    }

}
