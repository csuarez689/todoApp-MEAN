import { Component, Inject, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/app/models/task';
import { FileValidator } from 'ngx-material-file-input';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { List } from 'src/app/models/list';

@Component({
  selector: 'app-task-image-upload-form',
  templateUrl: './task-image-upload-form.component.html',
  styleUrls: ['./task-image-upload-form.component.scss'],
})
export class TaskImageUploadFormComponent {
  constructor(
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskImageUploadFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { task: Task; list: List }
  ) {
    dialogRef.disableClose = true;
  }

  imageUpload(): void {
    if (this.imagen.dirty) {
      this.taskService
        .uploadImage(
          this.data.task,
          this.data.list,
          this.imagen.value._files[0]
        )
        .subscribe((res: Task) => this.dialogRef.close(res));
    }
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  //Validaciones

  imagen = new FormControl(
    undefined,
    Validators.compose([
      Validators.required,
      this.imageExtensionValitor,
      FileValidator.maxContentSize(1048576),
    ])
  );

  imageExtensionValitor(control: FormControl) {
    let name = control.value ? control.value._files[0].name : '';
    const allowedExtensions = name.match(/(.png|.jpeg|.jpg)$/gi);
    return allowedExtensions ? null : { invalidextension: true };
  }

  getImageValidationError(): string {
    if (this.imagen.hasError('required')) {
      return 'Debe seleccionar una imagen';
    }
    if (this.imagen.hasError('maxContentSize')) {
      return 'La imagen no debe superar 1mb de tamaño';
    }
    if (this.imagen.hasError('invalidextension')) {
      return 'Solo se acepta formato png/jpg/jpeg';
    }
  }
}
