import { Component, OnInit, ElementRef, AfterViewInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit, AfterViewInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  private el = inject(ElementRef);
  private router = inject(Router);


  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  ngAfterViewInit() {
    const ionContent = this.el.nativeElement.querySelector('ion-content');
    if (ionContent && ionContent.shadowRoot) {
      const style = document.createElement('style');
      style.innerText = `
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .inner-scroll {
          background: linear-gradient(270deg, #2BC0E4, #EAECC6);
          background-size: 300% 300%;
          animation: gradient-animation 30s ease infinite;
        }
      `;
      ionContent.shadowRoot.appendChild(style);
    }
  }
  navigateToHome() {
    this.router.navigate(['/folder/create-account']);
  }
}
