import { Component, OnInit, Inject } from '@angular/core';
import { List } from 'src/app/models/list';
import { ListService } from 'src/app/services/list.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss'],
})
export class ListFormComponent {
  formTitle: string;

  constructor(
    private listService: ListService,
    public dialogRef: MatDialogRef<ListFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: List
  ) {
    dialogRef.disableClose = true;
    //editar
    if (data) {
      this.formTitle = 'Editar Lista';
      this.titulo.setValue(data.titulo);
    }
    //agregar nueva
    else {
      this.formTitle = 'Agregar Lista';
    }
  }

  agregarLista() {
    if (this.titulo.dirty) {
      this.listService
        .create({ titulo: this.titulo.value } as List)
        .subscribe((res: List) => this.dialogRef.close(res));
    }
    this.close();
  }

  editarLista() {
    if (this.titulo.dirty) {
      this.data.titulo = this.titulo.value;
      this.listService
        .update(this.data)
        .subscribe((res: List) => this.dialogRef.close(res));
    }
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  //validaciones de titulo
  titulo = new FormControl(
    '',
    Validators.compose([
      Validators.required,
      this.noWhitespaceValidator,
      Validators.minLength(3),
      Validators.maxLength(30),
    ])
  );
  noWhitespaceValidator(control: FormControl) {
    const notSpace = (control.value || '').match(/^[a-z0-9]+( [a-z0-9]+)*$/gi);
    return notSpace ? null : { whitespace: true };
  }

  getTituloValidationError(): string {
    if (this.titulo.hasError('required')) {
      return 'El titulo es obligatorio';
    }
    if (this.titulo.hasError('whitespace')) {
      return 'Formato invalido';
    }
    if (
      this.titulo.hasError('minlength') ||
      this.titulo.hasError('maxlength')
    ) {
      return 'El campo debe tener entre 3 y 30 caracteres';
    }
  }
}
