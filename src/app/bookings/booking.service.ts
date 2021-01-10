import {Injectable} from '@angular/core';
import {Booking} from './booking.model';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {delay, map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

interface BookingData {
    bookedFrom: string;
    bookedTo: string;
    firstName: string;
    guestNumber: number;
    lastName: string;
    placeId: string;
    placeImage: string;
    placeTitle: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})

export class BookingService {

    // tslint:disable-next-line:variable-name
    private _bookings = new BehaviorSubject<Booking[]>([]);

    get bookings() {
        return this._bookings.asObservable();
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date
    ) {
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
        let generatedId;

        return this.http
            .post<{ name: string }>
            ('https://angular-ionic-course-49d8b-default-rtdb.firebaseio.com/bookings.json',
                {...booking, id: null}
            ).pipe(
                switchMap(resData => {
                    generatedId = resData.name;
                    return this.bookings;
                }),
                take(1),
                tap(bookings => {
                    booking.id = generatedId;
                    this._bookings.next(bookings.concat(booking));
                })
            );
    }

    cancelBooking(bookingId: string) {

        return this.http.delete
        (`https://angular-ionic-course-49d8b-default-rtdb.firebaseio.com/bookings/${bookingId}.json`)
            .pipe(
                switchMap(() => {
                    return this.bookings;
                }),
                take(1),
                tap(bookings => {
                    return this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
                })
            );
    }

    fetchBookings() {
        return this.http.get<{ [key: string]: BookingData }>
        (`https://angular-ionic-course-49d8b-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`)
            .pipe(
                map(resData => {
                        const bookings = [];
                        for (const key in resData) {
                            if (resData.hasOwnProperty(key)) {
                                bookings.push(
                                    new Booking(
                                        key,
                                        resData[key].placeId,
                                        resData[key].userId,
                                        resData[key].placeTitle,
                                        resData[key].placeImage,
                                        resData[key].firstName,
                                        resData[key].lastName,
                                        resData[key].guestNumber,
                                        new Date(resData[key].bookedFrom),
                                        new Date(resData[key].bookedTo),
                                    )
                                );
                            }
                        }
                        return bookings;
                    }
                ),
                tap(bookings => {
                        this._bookings.next(bookings);
                    }
                )
            );
    }

    constructor(
        private authService: AuthService,
        private http: HttpClient
    ) {
    }
}
