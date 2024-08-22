import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';

import { Task } from './task.types';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _task: BehaviorSubject<Task> = new BehaviorSubject<Task>(null as any);
  private _tasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  constructor(private _httpClient: HttpClient) {}

  get task$(): Observable<Task> {
    return this._task.asObservable();
  }

  get tasks$(): Observable<Task[]> {
    return this._tasks.asObservable();
  }

  getTasks(): Observable<Task[]> {
    return this._httpClient.get<Task[]>('Tasks').pipe(
      tap((response) => {
        this._tasks.next(response);
      })
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this._tasks.pipe(
      take(1),
      map((tasks) => {
        // Find the task
        const task = tasks.find((item) => item.id === Number(id)) || null;

        // Update the task
        this._task.next(task as any);

        // Return the task
        return task;
      }),
      switchMap((task) => {
        if (!task) {
          return throwError('Could not found task with id of ' + id + '!');
        }

        return of(task);
      })
    );
  }

  createTask(task: Task): Observable<Task> {
    return this.tasks$.pipe(
      take(1),
      switchMap((tasks) =>
        this._httpClient.post<Task>('Tasks', task).pipe(
          map((newTask) => {
            // Update the tasks with the new task
            this._tasks.next([newTask, ...tasks]);

            // Return the new task
            return newTask;
          })
        )
      )
    );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.tasks$.pipe(
      take(1),
      switchMap((tasks) =>
        this._httpClient.put<Task>(`Tasks/${id}`, task).pipe(
          map((updatedTask) => {
            const index = tasks.findIndex((item) => item.id === id);
            tasks[index] = updatedTask;
            this._tasks.next(tasks);
            return updatedTask;
          }),
          switchMap((updatedTask) =>
            this.task$.pipe(
              take(1),
              filter((item) => item && item.id === id),
              tap(() => {
                this._task.next(updatedTask);
                return updatedTask;
              })
            )
          )
        )
      )
    );
  }

  deleteTask(id: number): Observable<boolean> {
    return this.tasks$.pipe(
      take(1),
      switchMap((tasks) =>
        this._httpClient.delete(`Tasks/${id}`).pipe(
          map((task: any) => {
            const index = tasks.findIndex((item) => item.id === id);
            tasks.splice(index, 1);
            this._tasks.next(tasks);
            return task;
          })
        )
      )
    );
  }
}
