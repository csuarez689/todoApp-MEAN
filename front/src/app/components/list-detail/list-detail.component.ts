import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ListService } from 'src/app/services/list.service';
import { Task } from 'src/app/models/task';
import { List } from 'src/app/models/list';
import { TaskService } from 'src/app/services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { GenericDeleteModalComponent } from '../generic-delete-modal/generic-delete-modal.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskImageUploadFormComponent } from '../task-image-upload-form/task-image-upload-form.component';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss'],
})
export class ListDetailComponent implements OnChanges {
  @Input() lists: List[]; //para llenar el form
  //lista completa o solo id para ficticia
  @Input() selectedList: List;

  @Output() editList = new EventEmitter();
  @Output() deleteList = new EventEmitter();

  tasks: Task[] = [];
  idLista: string;
  constructor(
    private listService: ListService,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedList) {
      //escucha cambios sobre la lista seleccionada
      this.getTasks();
    }
  }
  //obtene tareas
  getTasks(): void {
    if (this.selectedList)
      this.taskService
        .getAllTasksFromList(this.selectedList.id, '?sort_by=+titulo')
        .subscribe((res: Task[]) => (this.tasks = res));
  }
  //actualiza informacion de la lista
  updateLocalList(): void {
    if (this.selectedList)
      this.listService
        .getOne(this.selectedList.id)
        .subscribe((res: List) => (this.selectedList = res));
  }

  //emite evento de edicion de lista
  //para que lo maneje el padre
  //sobre la coleccion
  onEditList(): void {
    this.editList.emit();
  }

  //emite evento de borrado de lista
  //para que lo maneje el padre
  //sobre la coleccion
  onDeleteList(): void {
    this.deleteList.emit();
  }

  //Borrar tarea
  openDeleteTaskModal(task): void {
    const dialogRef = this.dialog.open(GenericDeleteModalComponent, {
      data: 'Tarea',
      minWidth: '400px',
    });
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        //elimino la lista
        this.taskService
          .delete(task, this.selectedList)
          .subscribe((deleted: any) => {
            this.getTasks();
            this.updateLocalList();
          });
      }
    });
  }

  //Agregar tarea
  openNewTaskForm(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: { lists: this.lists, selectedList: this.selectedList }, //paso listas para cargar select
      minWidth: '400px',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((res: Task) => {
      if (res) {
        this.getTasks();
        this.updateLocalList();
      }
    });
  }

  openEditTaskModal(event): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: { lists: this.lists, task: event, selectedList: this.selectedList }, //paso listas para cargar select
      minWidth: '400px',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((res: Task) => {
      if (res) {
        this.getTasks();
        this.updateLocalList();
      }
    });
  }

  openUploadTaskImageModal(event): void {
    const dialogRef = this.dialog.open(TaskImageUploadFormComponent, {
      data: { task: event, list: this.selectedList },
      minWidth: '400px',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((res: Task) => {
      if (res) {
        this.getTasks();
      }
    });
  }
}
