import { Routes } from '@angular/router';
import { Operator } from '../pages/operator/operator';

export const routes: Routes = [
	{ path: 'operator/:name', component: Operator },
	{ path: '', redirectTo: '/operator/defer', pathMatch: 'full' }
];
