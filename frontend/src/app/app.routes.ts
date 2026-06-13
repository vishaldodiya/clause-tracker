import { Routes } from '@angular/router';
import { ContractEditor } from './components/contract-editor/contract-editor';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: Dashboard
    },
    {
        path: 'contracts/:id',
        component: ContractEditor
    }
];
