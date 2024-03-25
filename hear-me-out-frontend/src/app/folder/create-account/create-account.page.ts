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
    this.injectStyles();
  }

  injectStyles() {
    const wrapper = this.elementRef.nativeElement.querySelector('.wrapper');
    if (wrapper) {
      const pulseDiv = document.createElement('div');
      pulseDiv.className = 'pulse';
      wrapper.insertBefore(pulseDiv, wrapper.firstChild);

      const style = document.createElement('style');
      style.textContent = `
        .pulse {
          width: 100px;
          height: 100px;
          color: #F4BF42;
          background: radial-gradient(circle at 60% 65%, currentColor 62%, #0000 65%) top left,
                radial-gradient(circle at 40% 65%, currentColor 62%, #0000 65%) top right,
                linear-gradient(to bottom left, currentColor 42%, #0000 43%) bottom left,
                linear-gradient(to bottom right, currentColor 42%, #0000 43%) bottom right;
          background-size: 50% 50%;
          background-repeat: no-repeat;
          position: relative;
          margin: 10% auto;
        }

        .pulse:after {
          content: "";
          position: absolute;
          inset: 0;
          background: inherit;
          opacity: 0.4;
          animation: pl3 1s infinite;
        }

        @keyframes pl3 {
          to {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `;
      if (wrapper.shadowRoot) {
        wrapper.shadowRoot.appendChild(style);
      } else {
        wrapper.appendChild(style);
      }
    }
  }

  saveName() {
    if (this.userName.trim()) {
      this.storageService.set('userName', this.userName.trim()).then(() => {
        this.router.navigate(['/folder/home']);
      });
    }
  }
}
