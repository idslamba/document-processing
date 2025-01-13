import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { SolventekConstants } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private readonly snackBar: MatSnackBar) { }

  showSnackbar(snackbarMessages: Array<any>, duration: number = 5000, type: number = SolventekConstants.MESSAGE_TYPES.SUCCESS) {
    const config: MatSnackBarConfig = {
      data: { messages: snackbarMessages, type: type },
      panelClass: 'custom-snackbar',
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    };

    this.snackBar.openFromComponent(SnackbarComponent, config);
  }

}
