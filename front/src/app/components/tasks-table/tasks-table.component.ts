import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations'; //for table animations
import { Task } from 'src/app/models/task';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TasksTableComponent implements OnChanges {
  @Output() deleteTaskEvent = new EventEmitter();
  @Output() editTaskEvent = new EventEmitter();
  @Output() uploadTaskImageEvent = new EventEmitter();
  @Input() tasks: Task[];
  columnsToDisplay: string[] = [
    'titulo',
    'fechaCreacion',
    'estado',
    'acciones',
  ];
  //show detail
  expandedElement: Task | null;
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.dataSource = new MatTableDataSource(this.tasks);
      this.dataSource.sort = this.sort;
    }
  }

  //Eliminar lista
  onDeleteTask(selectedTask) {
    this.deleteTaskEvent.emit(selectedTask);
  }
  onEditTask(selectedTask) {
    this.editTaskEvent.emit(selectedTask);
  }
  onUploadTaskImage(selectedTask) {
    this.uploadTaskImageEvent.emit(selectedTask);
  }
}
