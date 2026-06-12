import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ContractCreate } from './components/contract-create/contract-create';
import { ContractEditor } from './components/contract-editor/contract-editor';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'contracts/:id',
        component: ContractEditor
    }
];
