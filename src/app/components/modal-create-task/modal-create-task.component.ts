import { take } from 'rxjs';
import { TaskCategoryResponseInterface } from './../../interfaces/task-category-response-interface';
import { CategoriesService } from './../../services/categories.service';
import { StatusTaskInterface } from './../../interfaces/status-task-interface';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-create-task',
  templateUrl: './modal-create-task.component.html',
  styleUrls: ['./modal-create-task.component.css']
})
export class ModalCreateTaskComponent implements OnInit {
  @Input()
  taskStatus : StatusTaskInterface = {} as StatusTaskInterface;
  @Input()
  showCreationModal : boolean = false;
  @Output()
  showCreationModalChange = new EventEmitter<boolean>();

  listCategories : TaskCategoryResponseInterface [] = [];

  constructor(private categoryService : CategoriesService) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  closeCreationModal(){
    this.showCreationModalChange.emit(false);
  }

  getAllCategories() :void {
    this.categoryService.listAllCategories().pipe(take(1)).subscribe({
      next : response => this.listCategories = response,
      error : err => console.log(err)
    })
  }
}
