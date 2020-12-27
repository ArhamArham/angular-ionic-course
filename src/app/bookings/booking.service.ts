import {Injectable} from '@angular/core';
import {Booking} from './booking.model';

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    // tslint:disable-next-line:variable-name
    private _bookings: Booking[] = [
        new Booking(
            '1',
            'p1',
            '2',
            'Hello place title',
            2
        )
    ];
    get bookings() {
        return [...this._bookings];
    }

    constructor() {
    }
}
