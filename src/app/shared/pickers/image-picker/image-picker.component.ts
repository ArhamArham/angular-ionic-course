import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CameraResultType, CameraSource, Capacitor, Plugins} from '@capacitor/core';
import {Platform} from '@ionic/angular';

@Component({
    selector: 'app-image-picker',
    templateUrl: './image-picker.component.html',
    styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
    @Output() imagePick = new EventEmitter<string>();
    @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
    selectedImage: string | File;
    usePicker = false;

    constructor(private platform: Platform) {
        if (
            (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
            this.platform.is('desktop')
        ) {
            this.usePicker = true;
        }
    }

    ngOnInit() {
    }

    onPickImage() {
        if (!Capacitor.isPluginAvailable('Camera') || this.usePicker) {
            this.filePickerRef.nativeElement.click();
            return;
        }
        Plugins.Camera.getPhoto({
            quality: 50,
            source: CameraSource.Prompt,
            correctOrientation: true,
            height: 320,
            width: 200,
            resultType: CameraResultType.Base64
        }).then(image => {
            this.selectedImage = image.base64String;
            this.imagePick.emit(image.base64String);
        }).catch(error => {
            if (this.usePicker) {
                this.filePickerRef.nativeElement.click();
            }
            return false;
        });
    }

    onFileChosen(event: Event) {
        const pickedFile = (event.target as HTMLInputElement).files[0];
        if (!pickedFile) {
            return;
        }
        const fr = new FileReader();
        fr.onload = () => {
            const dataUrl = fr.result.toString();
            this.selectedImage = dataUrl;
            this.imagePick.emit(dataUrl);
        };
        fr.readAsDataURL(pickedFile);
    }
}
