
//https://polcode.com/resources/blog/is-angular-still-worth-it-in-2022/
// nice super-simple example of Observables

import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  getTitle$: Observable<string>;
  getTitleSubject: Subject<string> = new BehaviorSubject<string>('');

  constructor() {
    this.getTitle$ = this.getTitleSubject.asObservable();
  }

  setTitle(title: string): void {
    this.getTitleSubject.next(title);
  }
}




import { Component } from '@angular/core';
import { ArticleService } from "../services/article.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'articles';

  constructor(private articleService: ArticleService) {
    this.articleService.setTitle(this.title);
  }
}
