import { SafeHtml } from "@angular/platform-browser";

export interface OperatorItem {
  description: string;
  signature: string;
  related?: string[];
  examples: Codes[];
}

export interface Codes {
  title: string;
  code: string;
  link?: string;
  description?: string;
  copyState: string;
  safeCode?: SafeHtml;
}

export type OpsType = {
  [key: string]: OperatorItem;
};
