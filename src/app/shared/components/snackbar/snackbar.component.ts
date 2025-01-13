import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { SolventekConstants } from '../../utils/constants';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {

  type: number = 1;
  messages: Array<any> = [];
  SUCCESS = SolventekConstants.MESSAGE_TYPES.SUCCESS;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.type = data.type;
    this.messages = data.messages;
  }


}
