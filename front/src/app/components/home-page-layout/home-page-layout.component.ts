import { Component, OnInit } from '@angular/core';
import { ListService } from '../../services/list.service';
import { List } from '../../models/list';
import { MatDialog } from '@angular/material/dialog';
import { ListFormComponent } from '../list-form/list-form.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GenericDeleteModalComponent } from '../generic-delete-modal/generic-delete-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home-page-layout',
  templateUrl: './home-page-layout.component.html',
  styleUrls: ['./home-page-layout.component.scss'],
})
export class HomePageLayoutComponent implements OnInit {
  lists: List[] = [];
  selectedList: List;
  user: User;
  otherUser: User;

  constructor(
    private authService: AuthService,
    private listService: ListService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe((user) => {
      if (user) {
        this.user = user;
        this.listService.getAll().subscribe((res: List[]) => {
          this.lists = res;
          this.route.paramMap.subscribe((param: ParamMap) => {
            this.selectedList = this.lists.find(
              (x) => x.id == param.get('idLista')
            );
          });
        });
      }
    });
  }

  //Nueva Lista
  openNewListForm(): void {
    const dialogRef = this.dialog.open(ListFormComponent, {
      minWidth: '400px',
    });
    dialogRef.afterClosed().subscribe((res: List) => {
      //no need unsubcribe, on return this complete
      if (res) this.lists.push(res);
    });
  }

  //Editar Lista
  openEditListForm(): void {
    const dialogRef = this.dialog.open(ListFormComponent, {
      data: this.selectedList,
      minWidth: '400px',
    });
    dialogRef.afterClosed().subscribe((res: List) => {
      //no need unsubcribe, on return this complete
      if (res) {
        let auxList = this.lists.find((x) => x.id == res.id);
        auxList = res;
      }
    });
  }

  //Eliminar lista
  openDeleteModal() {
    const dialogRef = this.dialog.open(GenericDeleteModalComponent, {
      data: 'Lista',
      minWidth: '400px',
    });
    dialogRef.afterClosed().subscribe((res: boolean) => {
      //no need unsubcribe, on return this complete
      if (res) {
        //elimino la lista
        this.listService.delete(this.selectedList).subscribe((deleted: any) => {
          this.lists = this.lists.filter((x) => x.id !== deleted.id);
          this.router.navigate(['/listas']);
        });
      }
    });
  }

  navigate(tabChangeEvent): void {
    if (tabChangeEvent >= 0 && this.lists.length > 0)
      this.router.navigate([`/listas/${this.lists[tabChangeEvent].id}`]);
  }

  logout(): void {
    this.authService.logout();
  }
}
