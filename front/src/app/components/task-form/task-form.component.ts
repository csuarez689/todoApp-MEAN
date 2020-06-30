import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/app/models/task';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { List } from 'src/app/models/list';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  minDate: Date = new Date();
  formTitle: string;
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { lists: List[]; task: Task; selectedList: List }
  ) {
    dialogRef.disableClose = true;

    this.taskForm = this.fb.group({
      titulo: [
        '',
        Validators.compose([
          Validators.required,
          this.noWhitespaceValidator,
          Validators.minLength(3),
          Validators.maxLength(30),
        ]),
      ],
      descripcion: [''],
      fechaLimite: [''],
      prioridad: ['', Validators.required],
      estado: ['', Validators.required],
      idLista: ['', Validators.required],
    });
    if (data.task) {
      this.formTitle = 'Editar Tarea';
      //setear valores formulario
    } else {
      this.formTitle = 'Agregar Tarea';
    }
  }

  ngOnInit(): void {
    if (this.data.task) {
      for (let key in this.taskForm.controls) {
        this.taskForm.controls[key].setValue(this.data.task[key]);
      }
    } else
      this.taskForm.controls['idLista'].setValue(this.data.selectedList.id);
  }

  agregarTarea() {
    if (this.taskForm.dirty) {
      this.taskService
        .create(this.taskForm.value as Task)
        .subscribe((res: Task) => {
          this.dialogRef.close(res);
        });
    } else this.close();
  }

  editarTarea() {
    if (this.taskForm.dirty) {
      let editedTask: Task = this.taskForm.value;
      editedTask.id = this.data.task.id;
      this.taskService
        .update(editedTask, this.data.selectedList)
        .subscribe((res: Task) => this.dialogRef.close(res));
    } else this.close();
  }

  close() {
    this.dialogRef.close();
  }

  //Errores de validacion

  noWhitespaceValidator(control: FormControl) {
    const notSpace = (control.value || '').match(/^[a-z0-9]+( [a-z0-9]+)*$/gi);
    return notSpace ? null : { whitespace: true };
  }

  getTituloValidationError(): string {
    if (this.taskForm.get('titulo').hasError('required')) {
      return 'El titulo es obligatorio';
    }
    if (this.taskForm.get('titulo').hasError('whitespace')) {
      return 'Formato invalido';
    }
    if (
      this.taskForm.get('titulo').hasError('minlength') ||
      this.taskForm.get('titulo').hasError('maxlength')
    ) {
      return 'El campo debe tener entre 3 y 30 caracteres';
    }
  }
}
