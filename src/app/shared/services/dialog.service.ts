import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})

export class DialogService {

  constructor(private readonly dialog: MatDialog) { }

  openDialog(message: string, buttons?: Array<{ label: string, value: number, type: number }>) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message, buttons: buttons },
    });
    return dialogRef.afterClosed();
  }
}
