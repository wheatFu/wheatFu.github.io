import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { Codes, OperatorItem } from './type';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ops } from '../config';

hljs.registerLanguage('javascript', javascript);

@Component({
  selector: 'app-operator',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './operator.html',
  styleUrls: ['./operator.scss'],
})
export class Operator implements OnInit {
  operatorName: string = '';
  items: OperatorItem = {} as OperatorItem;
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.operatorName = params.get('name') as string;
      this.loadExample();
    });
  }

  private getSafeCode(code: string): SafeHtml {
    const highlighted = hljs.highlight(code, { language: 'javascript' }).value;
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  loadExample() {
    this.items = ops[this.operatorName];
    if (this.items?.examples) {
      this.items.examples = this.items.examples.map(example => ({
        ...example,
        safeCode: this.getSafeCode(example.code)
      }));
    }
    this.cdr.detectChanges();
  }

  copyCode(item: Codes) {
    navigator.clipboard.writeText(item.code || '').then(() => {
      item.copyState = '1';
      this.cdr.detectChanges();
    });
  }
}
