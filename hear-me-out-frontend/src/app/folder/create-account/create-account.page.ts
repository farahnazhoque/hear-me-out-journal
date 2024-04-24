import { Component, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements AfterViewInit {
  userName: string = '';

  constructor(
    private storageService: StorageService, 
    private router: Router,
    private elementRef: ElementRef
  ) {}

  async ngAfterViewInit() {
    await this.storageService.init(); // Wait for storage initialization
  }
  

  saveName() {
    if (this.userName.trim()) {
      this.storageService.set('userName', this.userName.trim()).then(() => {
        this.router.navigate(['/folder/home']);
      });
    }
  }
}
