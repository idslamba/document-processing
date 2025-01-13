import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProgressBarService } from '../../services/progress-bar.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule, AsyncPipe, MatProgressBarModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {

  constructor(public progressBarService: ProgressBarService) { }

}
