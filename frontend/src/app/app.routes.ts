import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ContractCreate } from './components/contract-create/contract-create';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'new',
        component: ContractCreate
    }
];
