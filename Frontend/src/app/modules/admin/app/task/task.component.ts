import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  NgForm,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, Subject, takeUntil, tap } from 'rxjs';

import { AlertComponent } from '../../../../components/alert/alert.component';
import { TaskService } from '../../../../core/Task/task.service';
import { Task } from '../../../../core/Task/task.types';
import { CommonModule, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent, UpperCasePipe, CommonModule],
  templateUrl: './task.component.html',
})
export class TaskComponent implements OnInit {
  @ViewChild('taskInNgForm') taskInNgForm!: NgForm;
  @ViewChild('alertComponent') alertComponent!: AlertComponent;

  tasks!: Task[];
  taskInForm!: UntypedFormGroup;
  tasksCount: any = {
    completed: 0,
    incomplete: 0,
    total: 0,
  };
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  updateTask: Task | null = null;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _taskService: TaskService,
    private _tasksService: TaskService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.taskInForm = this._formBuilder.group({
      Name: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      IsCompleted: [false, [Validators.required]],
      type: ['', Validators.required],
    });

    this._tasksService.getTasks().subscribe();
  }

  ngOnInit(): void {
    this._tasksService.tasks$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((tasks: Task[]) => {
        this.tasks = tasks;
        console.log(tasks);

        this.tasksCount.total = this.tasks.length;
        this.tasksCount.completed = this.tasks.filter(
          (task) => task.isCompleted
        ).length;
        this.tasksCount.incomplete =
          this.tasksCount.total - this.tasksCount.completed;
        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  addTask() {
    if (this.taskInForm.invalid) {
      return;
    }
    this.taskInForm.disable();
    if (this.updateTask) {
      this._tasksService
        .updateTask(this.updateTask.id, this.taskInForm.value)
        .subscribe();
      this.taskInForm.enable();
      this.taskInForm.reset({
        Name: '',
        Description: '',
        IsCompleted: false,
        type: '',
      });
      return;
    }
    this._tasksService.createTask(this.taskInForm.value).subscribe(() => {
      this.taskInForm.enable();
      this.taskInForm.reset({
        Name: '',
        Description: '',
        IsCompleted: false,
        type: '',
      });
    });
  }

  editTask(task: Task) {
    this.updateTask = task;
    this.taskInForm.patchValue({
      Name: task.name,
      Description: task.description,
      IsCompleted: task.isCompleted,
      type: task.type,
    });
  }
  deleteTask(task: Task) {
    const userConfirmed = window.confirm('Desea eliminar esta tarea?');
    if (userConfirmed) {
      this._tasksService.deleteTask(task.id).subscribe();
      this._changeDetectorRef.markForCheck();
    }
  }

  toggleTaskCompletion(task: Task) {
    task.isCompleted = !task.isCompleted;
    this._tasksService.updateTask(task.id, task).subscribe();
  }

  getTaskClass(type: string): string {
    switch (type) {
      case 'personal':
        return 'bg-blue-100';
      case 'work':
        return 'bg-yellow-100';
      case 'other':
        return 'bg-gray-100';
      default:
        return 'bg-white'; // Clase por defecto
    }
  }
}
