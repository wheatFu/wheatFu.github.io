import { zip } from 'rxjs';
import { OpsType } from './operator/type';

const ops: OpsType = {
  defer: {
    description: '以惰性方式创建 Observable，即仅在订阅时创建。',
    signature: 'function defer<T>(observableFactory: () => ObservableInput<T>): Observable<T>',
    examples: [
      {
        title: '基础示例',
        copyState: '0',
        link: 'https://stackblitz.com/edit/typescript-kfysugot?devtoolsheight=100&file=index.ts',
        code: `
import { defer, of } from 'rxjs';

const source$ = defer(() => of(Math.random()));
// A: 0.5435458110911687
source$.subscribe((v) => console.log('A:', v));
// B: 0.6895246709515185
source$.subscribe((v) => console.log('B:', v));

const sourceOf$ = of(Math.random());
// A: 0.36670385058500743
sourceOf$.subscribe((v) => console.log('A:', v));
// B: 0.36670385058500743
sourceOf$.subscribe((v) => console.log('B:', v));
`,
      },
      {
        title: '项目示例一',
        copyState: '0',
        description:
          '在守卫里按“订阅时”决定是否调用同步/异步检查（避免在守卫实例化时就执行）:如果守卫的判断依赖缓存或同步函数，使用 defer 可以确保逻辑在每次导航检查时被执行，而不是在服务创建时执行一次。',
        code: `
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private cache: CacheService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return defer(() => {
      const cached = this.cache.get('token');
      if (cached) return of(true);
      return this.auth.checkToken().pipe(
        tap(ok => { if (!ok) this.router.navigate(['/login']); })
      );
    });
  }
}
`,
      },
    ],
    related: ['of'],
  },

  of: {
    description: '按顺序发出任意数量的值。',
    signature: 'of(...values, scheduler: Scheduler): Observable',
    examples: [
      {
        title: '基础示例',
        copyState: '0',
        link: 'https://stackblitz.com/edit/typescript-m1jbw9?devtoolsheight=100&file=index.ts',
        description: '发出对象、数组和函数',
        code: `
import { of } from 'rxjs';
//emits values of any type
const source = of({ name: 'Brian' }, [1, 2, 3], function hello() {
  return 'Hello';
});
//Logs: {name: 'Brian}, [1,2,3], function hello() { return 'Hello' }
const subscribe = source.subscribe(val => console.log(val));
`,
      },
      {
        title: '项目示例',
        copyState: '0',
        code: `
// 1、在早期返回处显式返回 Observable，保持调用方能统一处理 subscribe/pipe
return of([] as GiftCards[]);

// 2、API异常时，转换为安全的数据返回
return this.http.get('/api').pipe(
  catchError(() => of(null))
);

// 3、单元测试中：模拟服务返回
getCompanyTimeZone: jest.fn(() => of('Asia/Shanghai'))
`,
      },
    ],
    related: ['defer'],
  },

  from: {
    description: '将数组、类数组、promise 或迭代器转换成 observable 。',
    signature:
      'from(ish: ObservableInput, mapFn: function, thisArg: any, scheduler: Scheduler): Observable',
    related: ['of'],
    examples: [
      {
        title: '基础示例一',
        copyState: '0',
        description: '数组转换而来的 observable',
        link: 'https://stackblitz.com/edit/typescript-sckwsw?devtoolsheight=100&file=index.ts',
        code: `
import { from } from 'rxjs';

//emit array as a sequence of values
const arraySource = from([1, 2, 3, 4, 5]);

//Logs: 1,2,3,4,5
const subscribe = arraySource.subscribe(val => console.log(val));
        `,
      },
      {
        title: '基础示例二',
        copyState: '0',
        description: '字符串转换而来的 observable',
        link: 'https://stackblitz.com/edit/typescript-19nejh?devtoolsheight=100&file=index.ts',
        code: `
import { from } from 'rxjs';

//emit string as a sequence
const source = from('Hello World');

//Logs: 'H','e','l','l','o',' ','W','o','r','l','d'
const subscribe = source.subscribe(val => console.log(val));
        `,
      },
      {
        title: '项目示例一',
        copyState: '0',
        description: '场景: 拿到Gift cards数组，逐项调用接口查询余额，并最终得到结果数组',
        code: `
import { from } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';

from(giftCardsArray).pipe(
  mergeMap(card => this.paymentService.inquireCard(card.id)),
  toArray()
).subscribe(resultArray => { /* 逐项处理后得到数组 */ });`,
      },
      {
        title: '项目示例二',
        copyState: '0',
        description: '场景: FileReader、某些 SDK 使用Promise回调, 将其转换为Observable',
        code: `
function readFileAsText(file: File): Observable<string> {
  const fileText = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
  return from(fileText);
}`,
      },
    ],
  },

  fromEvent: {
    description: '从 DOM 事件、Node.js EventEmitter 或其他类似的事件目标创建 Observable。',
    signature:
      'fromEvent(target: EventTargetLike, eventName: string, options?: EventListenerOptions): Observable',
    examples: [
      {
        title: '基础示例',
        description: '鼠标事件转换而来的 observable',
        copyState: '0',
        link: 'https://stackblitz.com/edit/typescript-mfyefr?devtoolsheight=50&file=index.ts',
        code: `
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

// 创建发出点击事件的 observable
const source = fromEvent(document, 'click');
// 映射成给定的事件时间戳
const example = source.pipe(map(event => \`Event time: \${event.timeStamp}\`));
// 输出 (示例中的数字以运行时为准): 'Event time: 7276.390000000001'
const subscribe = example.subscribe(val => console.log(val));`,
      },
      {
        title: '项目示例一',
        description: '场景：为第三方组件创建自定义事件',
        copyState: '0',
        code: `
// copied from antd button code, directly @HostListener click and stopPropagation not work
this.ngZone.runOutsideAngular(() => {
  fromEvent<MouseEvent>(this.elementRef.nativeElement, 'click', {
    capture: true,
  })
    .pipe(takeUntil(this.cancelSubscription$))
    .subscribe((event) => {
      if (this.disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    });
})`,
      },
      {
        title: '项目示例二',
        description: '场景：监听freedom pay全局事件',
        copyState: '0',
        code: `
public addEventListener(): Observable<boolean> {
  return fromEvent(window, 'message').pipe(
    mergeMap((res: MessageEvent) => this.handleIframeMessage(res)),
    takeUntil(this.cancelSubscription$)
  );
}`,
      },
    ],
  },

  iif: {
    description: '根据条件选择不同的 Observable',
    signature:
      'iif(condition: () => boolean, trueResult: ObservableInput, falseResult: ObservableInput): Observable',
    examples: [
      {
        title: '基础示例',
        description: '控制对 Observable 的访问',
        copyState: '0',
        link: 'https://stackblitz.com/edit/typescript-ns4tqhms?devtoolsheight=100&file=index.ts',
        code: `
import { iif, of, EMPTY } from 'rxjs';

let accessGranted;
const observableIfYouHaveAccess = iif(
  () => accessGranted,
  of('It seems you have an access...'),
  EMPTY
);

accessGranted = true;
observableIfYouHaveAccess.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('The end'),
});

// Logs:
// 'It seems you have an access...'
// 'The end'

accessGranted = false;
observableIfYouHaveAccess.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('The end'),
});

// Logs:
// 'The end'
`,
      },
      {
        title: '项目示例',
        copyState: '0',
        description: '场景：ss 登录，根据用户是否需要 MFA 进行不同的处理',
        code: `
return iif(
  () => require_mfa,
  this.requestMFAPersonToken(person_token, res.skipHandleRedirect),
  of(person_token)
).pipe(
  concatMap((token) =>
    this.authService.personTokenToAccessToken(token)
  ),
  map((access_token) => ({ ...res, access_token }))
);`,
      },
    ],
    related: ['defer'],
  },

  generate: {
    description: '通过指定的调度循环生成生成 Observable。',
    signature:
      'generate(initialState: T, condition: (state: T) => boolean, iterate: (state: T) => T): Observable<T>',
    related: ['range'],
    examples: [
      {
        title: '基础示例',
        description: '生成从1开始，每次翻倍，直到小于3的数字序列',
        copyState: '0',
        link: 'https://stackblitz.com/edit/typescript-nffb8rey?devtoolsheight=100&file=index.ts',
        code: `
import { generate } from 'rxjs';

const source$ = generate({
  initialState: 1,
  condition: (x) => x < 3,
  resultSelector: (x: number) => x + 1,
  iterate: (x) => x * 2,
});

// Logs: 2, 3
source$.subscribe(console.log);`,
      },
    ],
  },

  throwError: {
    description: '创建一个发出错误通知的 Observable',
    signature: 'throwError(errorOrErrorFactory: any): Observable<never>',
    related: ['empty'],
    examples: [
      {
        title: '基础示例',
        copyState: '0',
        link: 'https://stackblitz.com/edit/typescript-mzjgtqax?devtoolsheight=100&file=index.ts',
        code: `
import { throwError } from 'rxjs';

const source$ = throwError(() => new Error('Invalid card'));

// Logs: error -> Invalid card
source$.subscribe({
  next: console.log,
  error: (err) => console.error(err.message),
});`,
      },
      {
        title: '项目示例',
        description:
          'http拦截器，如果有403错误且不需要错误提示，则返回EMPTY。反之返回错误原本的错误信息',
        copyState: '0',
        code: `
import { throwError } from 'rxjs';

return iif(
  () =>
  err?.status === 403 && !(oldReq.params?.get('skipErrorToastIf'))?.(err),
  EMPTY,
  throwError(() => err)
);`,
      },
    ],
  },

  empty: {
    description: '创建一个不发出任何项但立即发出完成通知的 Observable。',
    signature: 'EMPTY: Observable<never>',
    related: ['throwError'],
    examples: [
      {
        title: '基础示例',
        copyState: '0',
        link: 'https://stackblitz.com/edit/typescript-53drsdc7?devtoolsheight=100&file=index.ts',
        code: `
import { EMPTY } from 'rxjs';

//Logs: 'Complete!'
const subscribe = EMPTY.subscribe({
  next: () => console.log('Next'),
  complete: () => console.log('Complete!'),
})`,
      },
      {
        title: '项目示例一',
        description: '递归请求order list，直到最后一页，使用EMPTY作为默认值，停止递归',
        copyState: '0',
        code: `
this.fetchOrderFromXoo(eventId, suiteIds, page * this.pageSize)
  .pipe(
    expand((res) => {
      page++;
      // 如果当前页是最后一页，返回 EMPTY -> 表示不再继续展开（不发值，立即 complete）
      return res.current_page === res.page_count
        ? EMPTY
        : this.fetchOrderFromXoo(eventId, suiteIds, page * this.pageSize);
    }),
    ...
  )`,
      },
      {
        title: '项目示例二',
        description: '用于流程控制（比如在组合流中占位但不影响结果）',
        copyState: '0',
        code: `
// 在 concat 中如果某步不需要执行可以返回 EMPTY 作为占位完成
concat(step1$, maybeStep2$ ?? EMPTY, step3$)`,
      },
    ],
  },

  interval: {
    description: '创建一个按指定时间间隔发出递增数字的 Observable。',
    signature:
      'interval(period: number = 0, scheduler: SchedulerLike = asyncScheduler): Observable<number>',
    related: ['timer', 'delay'],
    examples: [
      {
        copyState: '0',
        description: '每秒发出自增数字',
        link: 'https://stackblitz.com/edit/typescript-ohddud?devtoolsheight=100&file=index.ts',
        title: '基础示例',
        code: `
import { interval } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

//emit value in sequence every 1 second
const source = interval(1000);

//Logs: 0,1,2,3,4,5....
const example = source.pipe(
  take(5), //take only the first 5 values
  finalize(() => console.log('Sequence complete')) // Execute when the observable completes
);
const subscribe = example.subscribe((val) => console.log(val));
`,
      },
      {
        title: '项目示例',
        copyState: '0',
        description: '每 5 秒轮询一次，立即触发一次',
        code: `
import { interval } from 'rxjs';
import { switchMap, takeUntil, startWith, filter } from 'rxjs/operators';

interval(5000)
  .pipe(
    startWith(0),
    takeUntil(this.cancelSubscription$),
    switchMap(() => this.paymentService.getPaymentStatus(paymentId)),
    filter(status => !!status),
  )
  .subscribe(status => { /* 更新 UI */ });`,
      },
    ],
  },

  timer: {
    description: '给定持续时间后，再按照指定间隔时间依次发出数字',
    signature:
      'timer(dueTime: number | Date = 0, period: number = 0, scheduler: SchedulerLike = asyncScheduler): Observable<number>',
    related: ['interval', 'delay'],
    examples: [
      {
        title: '基础示例',
        copyState: '0',
        description: '每 5 秒轮询一次，立即触发一次',
        link: 'https://stackblitz.com/edit/typescript-mzdjfz7d?devtoolsheight=100&file=index.ts',
        code: `
import { timer } from 'rxjs';

//立即发出0, 然后每秒发出递增数字
const source = timer(0, 1000);

//Logs: 0,1,2,3,4,5....
const subscribe = source.subscribe((val) => console.log(val));`,
      },
      {
        title: '项目示例一',
        copyState: '0',
        description: '一次性延迟执行',
        code: `
import { timer } from 'rxjs';

// 3s 后自动关闭 modal
timer(3000).subscribe(() => this.modal.close());`,
      },
      {
        title: '项目示例二',
        copyState: '0',
        description: '错误重试的延迟与指数退避',
        code: `
import { timer } from 'rxjs';
import { retryWhen, delayWhen } from 'rxjs/operators';

this.http.get('/api')
  .pipe(
    retryWhen(errors =>
      errors.pipe(
        delayWhen((_, i) => timer(Math.pow(2, i) * 1000)), // 1s,2s,4s...
        take(3)
      )
    )
  )
  .subscribe();`,
      },
    ],
  },

  combineLatest: {
    description: '当任一输入 Observable 发出值时，发出来自每个输入 Observable 的最新值。',
    signature: 'combineLatest(...observables: ObservableInput[]): Observable<any[]>',
    related: ['forkJoin', 'zip'],
    examples: [
      {
        title: '基础示例',
        copyState: '0',
        description: '组合两个输入流，任一流发出值时，输出最新值',
        link: 'https://stackblitz.com/edit/typescript-ihcxud?devtoolsheight=50&file=index.ts',
        code: `
import { fromEvent, combineLatest } from 'rxjs';
import { mapTo, startWith, scan, tap, map } from 'rxjs/operators';

// elem refs
const redTotal = document.getElementById('red-total');
const blackTotal = document.getElementById('black-total');
const total = document.getElementById('total');

const addOneClick$ = id =>
  fromEvent(document.getElementById(id), 'click').pipe(
    // map every click to 1
    mapTo(1),
    // keep a running total
    scan((acc, curr) => acc + curr, 0),
    startWith(0)
  );

combineLatest(addOneClick$('red'), addOneClick$('black'))
  .subscribe(([red, black]: any) => {
    redTotal.innerHTML = red;
    blackTotal.innerHTML = black;
    total.innerHTML = red + black;
  });`,
      },
      {
        title: '项目示例',
        description: '基于多个条件决定行为（使能/禁用、过滤、排序等）',
        copyState: '0',
        code: `
combineLatest([searchTerm$.pipe(debounceTime(300)), filter$, sort$])
  .pipe(
    switchMap(([search, filter, sort]) =>
      api.search({ q: search, cat: filter, s: sort })
    )
  )
  .subscribe();`,
      },
    ],
  },

  concat: {
    description:
      '按照顺序，前一个 observable 完成了再订阅下一个 observable 并发出值(顺序执行，串行)',
    signature: 'concat(...observables: ObservableInput[]): Observable',
    related: ['merge', 'forkJoin'],
    examples: [
      {
        title: '基础示例',
        copyState: '0',
        description: '使用延迟的 source observable 进行 concat',
        link: 'https://stackblitz.com/edit/typescript-vsphry?devtoolsheight=100&file=index.ts',
        code: `
import { of, concat } from 'rxjs';
import { delay } from 'rxjs/operators';

concat(
  of(1,2,3).pipe(delay(3000)),
  // after 3s, the first observable will complete and subsequent observable subscribed with values emitted
  of(4,5,6)
)
// Logs: 1,2,3,4,5,6
.subscribe(console.log);`,
      },
      {
        title: '项目示例',
        description: '顺序 HTTP 请求（第二个请求依赖第一个完成，但不依赖其结果）',
        copyState: '0',
        code: `
import { concat } from 'rxjs';

concat(
  this.http.post('/api/set-status', body1),
  this.http.get('/api/user-info', body2)
).subscribe(); // 必须先设置状态再获取用户信息
`,
      },
    ],
  },

  merge: {
    description:
      '将多个 Observable 合并为一个，任一Observable 发出值时，输出该值(无序，并行，最后一个参数限制并发数)',
    signature:
      'merge(...observables: ObservableInput[], concurrent: number = Number.POSITIVE_INFINITY): Observable',
    related: ['mergeMap', 'concat'],
    examples: [
      {
        title: '基础示例',
        description: '合并多个输入流，任一流发出值时，输出该值',
        link: 'https://stackblitz.com/edit/typescript-ohq6rx?devtoolsheight=100&file=index.ts',
        copyState: '0',
        code: `
import { mapTo } from 'rxjs/operators';
import { interval, merge } from 'rxjs';

//emit every 2.5 seconds
const first = interval(2500);
//emit every 2 seconds
const second = interval(2000);
//emit every 1.5 seconds
const third = interval(1500);
//emit every 1 second
const fourth = interval(1000);

//emit outputs from one observable
const example = merge(
  first.pipe(mapTo('FIRST!')),
  second.pipe(mapTo('SECOND!')),
  third.pipe(mapTo('THIRD')),
  fourth.pipe(mapTo('FOURTH'))
);

//Logs: "FOURTH", "THIRD", "SECOND!", "FOURTH", "FIRST!", "THIRD", "FOURTH", ...
const subscribe = example.subscribe(val => console.log(val));`,
      },
      {
        title: '项目示例一',
        description: 'ss: 当组件销毁或者手动cancel timer时，取消source流的订阅',
        copyState: '0',
        code: `
source$.pipe(
  takeUntil(merge(this.cancelTimer$, this.destroy$))
)`,
      },
      {
        title: '项目示例二',
        description:
          'SCP: 把多个事件流合并成一个流 — 只要任意一个子流发出值，merge 就向下游发出该值（不丢失，也不等待其它流）。因此任何一个过滤条件改变、分页或排序事件都会立即触发刷新。',
        copyState: '0',
        code: `
private subscribeGridAction(): void {
    merge(
      this.filterGridAction([
        'QUICK_FILTER_CHANGED',
        'PAGE_SIZE_CHANGED',
        'FILTER_MODEL_CHANGED',
      ]),
      this.filterGridAction('SORT_MODEL_CHANGED').pipe(
        this.userGridOptions.suppressMultiSort ? identity : waitShiftKeyUp()
      ),
      this.filterGridAction('CURRENT_PAGE_CHANGED').pipe(
        debounceTime(this.gridOptions.searchDebounceTime)
      )
    ).subscribe(() => {
      this.refreshList.emit();
    });
  }`,
      },
    ],
  },

  forkJoin: {
    description:
      '当所有源 observable 都完成时，发出最后一组值（只在所有源 observable 都完成时才会发出值，与 Promise.all 的使用方式类似',
    signature: 'forkJoin(...observables: ObservableInput[]): Observable',
    related: ['combineLatest', 'zip'],
    examples: [
      {
        title: '基础示例',
        copyState: '0',
        description: '发起任意多个请求',
        link: 'https://stackblitz.com/edit/typescript-3mbbjw?devtoolsheight=100&file=index.ts',
        code: `
import { mergeMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

const myPromise = val =>
  new Promise(resolve =>
    setTimeout(() => resolve(\`Promise Resolved: \${val}\`), 5000)
  );

const source = of([1, 2, 3, 4, 5]);
//emit array of all 5 results
const example = source.pipe(mergeMap(q => forkJoin(...q.map(myPromise))));
/*
  Logs:
  [
   "Promise Resolved: 1",
   "Promise Resolved: 2",
   "Promise Resolved: 3",
   "Promise Resolved: 4",
   "Promise Resolved: 5"
  ]
*/
const subscribe = example.subscribe(val => console.log(val));`,
      },
      {
        title: '项目示例',
        copyState: '0',
        description:
          'SCP: 前置api全部请求完成之后在渲染ui（⚠️ 内部某个请求error，会影响整个流及后续订阅，推荐内部处理）',
        code: `
forkJoin([
  this.suiteAdminConfigService.getOrderSettings(),
  this.suiteAdminConfigService.getAdminFeeOptions(),
  this.suiteAdminConfigService.getAdminFeeSettings(),
  this.adminService.getGuestSetting().pipe(catchError(error => of([]))),
]).subscribe(
  ([orderSettingRes, adminFeeOptionLists, adminFees, guestSetting]) => {/* do something */}
)`,
      },
    ],
  },

  partition: {
    description: '将源 Observable 分割成两个，分别发出满足和不满足条件的值。',
    signature:
      'partition<T>(source: Observable<T>, predicate: (value: T) => boolean): [Observable<T>, Observable<T>]',
    related: ['filter'],
    examples: [
      {
        title: '基础示例',
        copyState: '0',
        description: '分割奇数和偶数',
        link: 'https://stackblitz.com/edit/typescript-gr3ljs?devtoolsheight=100&file=index.ts',
        code: `
import { from, merge } from 'rxjs';
import { partition, map } from 'rxjs/operators';

const source = from([1, 2, 3, 4, 5, 6]);
// 第一个值(events)返回 true 的数字集合，第二个值(odds)是返回 false 的数字集合
const [evens, odds] = source.pipe(partition(val => val % 2 === 0));

/*
  Logs:
  "Even: 2"
  "Even: 4"
  "Even: 6"
  "Odd: 1"
  "Odd: 3"
  "Odd: 5"
*/
const subscribe = merge(
  evens.pipe(map(val => \`Even: \${val}\`)),
  odds.pipe(map(val => \`Odd: \${val}\`))
).subscribe(val => console.log(val));`,
      },
      {
        title: '项目示例',
        description: '获取多个api结果后，分割成功和失败的结果',
        copyState: '0',
        code: `
import { merge, of, from, throwError } from 'rxjs';
import { map, partition, catchError, mergeMap } from 'rxjs/operators';

const productIds = [1, 2, 3, 4, 5, 6];

const mockApi$ = (val: number) => {
  if (val > 3) {
    return throwError(val).pipe(catchError((val) => of({ error: val })));
  }
  return of({ success: val });
};

const example = from(productIds).pipe(mergeMap(mockApi$));

//split on success or error
const [success, error] = example.pipe(partition((res) => res.success));

/*
  Logs:
  "Success! 1"
  "Success! 2"
  "Success! 3"
  "Error! 4"
  "Error! 5"
  "Error! 6"
*/
const subscribe = merge(
  success.pipe(map((val) => \`Success! \${val.success}\`)),
  error.pipe(map((val) => \`Error! \${val.error}\`))
).subscribe((val) => console.log(val));
`,
      },
    ],
  },

  zip:  {
    description: '操作符会订阅所有内部 observables，然后等待每个发出一个值。一旦发生这种情况，将发出具有相应索引的所有值。这会持续进行，直到至少一个内部 observable 完成。',
    signature: 'zip(...observables: ObservableInput[]): Observable<any[]>',
    related: ['combineLatest', 'forkJoin'],
    examples: [
      {
        title: '基础示例',
        copyState: '0',
        description: '组合多个输入流，所有流都发出值时，输出该组值',
        link: 'https://stackblitz.com/edit/typescript-azyc3h7q?devtoolsheight=100&file=index.ts',
        code: `
import { interval, zip } from 'rxjs';
import { map, take } from 'rxjs/operators';

// 每隔1秒依次输出1到5
const count1To5$ = interval(1000).pipe(
  take(5),
  map((i) => i + 1)
);

// 每隔3秒依次输出6到9
const count6To9$ = interval(3000).pipe(
  take(4),
  map((i) => i + 6)
);

zip(count1To5$, count6To9$).subscribe(console.log);
// (~3s apart) [1,6], [2,7], [3,8], [4,9]
`
      }
    ]
  }
};

export { ops };
