import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('doc');

  operators = [
    {
      title: '创建',
      operators: [
        'defer',
        'of',
        'from',
        'fromEvent',
        'iif',
        'generate',
        'throwError',
        'empty',
        'interval',
        'timer',
      ],
    },
    {
      title: '组合',
      operators: ['combineLatest', 'concat', 'merge', 'forkJoin', 'partition', 'zip'],
    },
    {
      title: '转换',
      operators: [
        'map',
        'mapTo',
        'mergeMap',
        'switchMap',
        'concatMap',
        'exhaustMap',
        'pairwise',
        'expand',
      ],
    },
    {
      title: '过滤',
      operators: [
        'auditTime',
        'debounce',
        'debounceTime',
        'throttle',
        'throttleTime',
        'distinctUntilChanged',
        'filter',
        'first',
        'last',
        'take',
        'takeUntil',
        'takeLast',
        'skip',
      ],
    },
    {
      title: '多播',
      operators: [
        'share',
        'shareReplay',
      ],
    },
    {
      title: '错误处理',
      operators: [
        'catchError',
        'retry',
        'retryWhen',
      ],
    },
    {
      title: '工具类',
      operators: [
        'tap',
        'finalize',
        'delay',
        'timeout',
        'toArray',
        'startWith',
      ],
    },
  ];
}
