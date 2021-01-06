import {Injectable} from '@angular/core';
import {Booking} from './booking.model';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {delay, take, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    // tslint:disable-next-line:variable-name
    private _bookings = new BehaviorSubject<Booking[]>([
        new Booking(
            '1',
            'p1',
            '2',
            'Hello place title',
            'https://images.unsplash.com/photo-1602526211878-5a18d013bc58?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1011&q=80',
            'arham',
            'rahim',
            2,
            new Date(),
            new Date()
        )
    ]);
    get bookings() {
        return this._bookings.asObservable();
    }

    addBooking(placeId: string, placeTitle: string, placeImage: string, firstName: string, lastName: string, guestNumber: number, dateFrom: Date, dateTo: Date) {
        const booking = new Booking(Math.random().toString(),
            placeId,
            this.authService.userId,
            placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo
        );
        return this.bookings.pipe(
            take(1),
            delay(1000),
            tap(bookings => {
                this._bookings.next(bookings.concat(booking));
            })
        );
    }

    cancelBooking(bookingId: string) {
        return this.bookings.pipe(
            take(1),
            delay(1000),
            tap(bookings => {
                this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
            })
        );
    }

    constructor(private authService: AuthService) {
    }
}
