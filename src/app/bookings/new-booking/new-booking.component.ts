import {Component, Input, OnInit} from '@angular/core';
import {Place} from '../../places/place.model';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-new-booking',
    templateUrl: './new-booking.component.html',
    styleUrls: ['./new-booking.component.scss'],
})
export class NewBookingComponent implements OnInit {

    @Input() selectedPlace: Place;

    constructor(private modalCtrl: ModalController) {
    }

    ngOnInit() {
    }

    onCancel() {
        this.modalCtrl.dismiss('', 'cancel').then();
    }

    onBookPlace() {
        this.modalCtrl.dismiss({message: 'This is dummy message'}, 'confirm').then();
    }
}
