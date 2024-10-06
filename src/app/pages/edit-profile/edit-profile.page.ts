import { TokenService } from './../../services/token.service';

import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UtilService } from 'src/app/services/util.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  user: User;
  selectedImage: string | undefined;

  constructor(
    public util: UtilService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.getUserData();
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri, // Use Uri to get a web URL for the image
      source: CameraSource.Camera, // Use CameraSource.Photos to select from gallery
    });

    // Save the selected image
    this.selectedImage = image.webPath; // Save the image URL to display it
  }

  getUserData() {
    const userData = this.tokenService.getUser();
    if (userData) {
      this.user = userData as User; // Garanta que userData é do tipo User
    }
  }

  onBack() {
    this.util.onBack();
  }

}
