import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-generic-delete-modal',
  templateUrl: './generic-delete-modal.component.html',
  styleUrls: ['./generic-delete-modal.component.scss'],
})
export class GenericDeleteModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<GenericDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  deleteModel() {
    this.dialogRef.close(true);
  }
}
