
import { AnimationController } from '@ionic/angular';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface VoiceFolderState {
  title: string;
}

@Component({
  selector: 'app-voice-folder',
  templateUrl: './voice-folder.page.html',
  styleUrls: ['./voice-folder.page.scss'],
})
export class VoiceFolderPage implements OnInit {
  title: string = 'Default Title'; // Default title

  constructor(private animationCtrl: AnimationController, private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as VoiceFolderState;
    this.title = state?.title;
  }

  backToJournal() {
    const element = document.querySelector('.page');
    if (element) {
      const animation = this.animationCtrl.create()
        .addElement(element)
        .duration(500)
        .fromTo('transform', 'translateX(-100%)', 'translateX(0%)') // Changed from -100% to 100%
        .fromTo('opacity', '0', '1');
  
      animation.play().then(() => {
        // Navigate after the animation completes
        this.router.navigateByUrl('/folder/journal');
      });
    } else {
      // Handle the case where the element isn't found
      // For example, navigate without an animation
      this.router.navigateByUrl('/folder/journal');
    }
  }
  
}
