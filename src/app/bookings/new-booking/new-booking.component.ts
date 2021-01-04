import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Place} from '../../places/place.model';
import {ModalController} from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
    selector: 'app-new-booking',
    templateUrl: './new-booking.component.html',
    styleUrls: ['./new-booking.component.scss'],
})
export class NewBookingComponent implements OnInit {

    @ViewChild('form', null) form: NgForm;
    @Input() selectedPlace: Place;
    @Input() selectedMode: 'select' | 'random';
    private startDate: string;
    private endDate: string;

    constructor(private modalCtrl: ModalController) {
    }

    ngOnInit() {
        const dateFrom = new Date(this.selectedPlace.dateFrom);
        const dateTo = new Date(this.selectedPlace.dateTo);
        if (this.selectedMode === 'random') {
            this.startDate = new Date(dateFrom.getTime() +
                Math.random() *
                (dateTo.getTime() - 7 * 24 * 60 * 60 * 1000)
            ).toISOString();
            this.endDate = new Date(new Date(this.startDate).getTime() +
                Math.random() * (new Date(this.startDate).getTime() +
                    6 * 24 * 60 * 60 * 1000 -
                    new Date(this.startDate).getTime())
            ).toISOString();
        }
    }

    onCancel() {
        this.modalCtrl.dismiss('', 'cancel').then();
    }

    onBookPlace() {
        this.modalCtrl.dismiss({message: 'This is dummy message'}, 'confirm').then();
    }

    isDatesValid() {
        if (this.form === undefined) {
            return false;
        }
        const startDate = new Date(this.form.value.date_from);
        const endDate = new Date(this.form.value.date_to);
        return endDate > startDate;
    }
}
