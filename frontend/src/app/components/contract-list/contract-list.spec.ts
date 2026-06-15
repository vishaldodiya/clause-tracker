import { TestBed } from '@angular/core/testing'
import { signal } from '@angular/core'
import { of } from 'rxjs'
import { Router } from '@angular/router'
import { ContractList } from './contract-list'
import { ContractService } from '../../services/contract.service'
import { ProgressService } from '../../services/progress.service'
import { Contract, ContractProgress } from '../../models/contract.model'

const mockContracts: Contract[] = [
    {
        id: 'contract-1',
        name: 'Alpha Contract',
        created_at: new Date(),
        updated_at: new Date(),
        tags: []
    },
    {
        id: 'contract-2',
        name: 'Beta Contract',
        created_at: new Date(),
        updated_at: new Date(),
        tags: [{ id: 'tag-1', name: 'Legal', created_at: new Date() }]
    }
]

const mockProgress: ContractProgress[] = [
    { contract_id: 'contract-1', progress: { total: 10, labelled: 4 } }
]

describe('ContractList', () => {
    let component: ContractList
    let contractsSignal: ReturnType<typeof signal<Contract[]>>
    let contractService: any
    let progressService: any
    let router: { navigate: ReturnType<typeof vi.fn> }

    beforeEach(async () => {
        contractsSignal = signal<Contract[]>([])
        contractService = {
            contracts: contractsSignal,
            getContracts: vi.fn(() => {
                contractsSignal.set(mockContracts)
                return of(mockContracts)
            })
        }
        progressService = {
            progress: signal<ContractProgress[]>([]),
            getContractProgress: vi.fn(() => of(mockProgress))
        }
        router = { navigate: vi.fn() }

        await TestBed.configureTestingModule({
            imports: [ContractList],
            providers: [
                { provide: ContractService, useValue: contractService },
                { provide: ProgressService, useValue: progressService },
                { provide: Router, useValue: router }
            ]
        }).compileComponents()

        component = TestBed.createComponent(ContractList).componentInstance
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('ngOnInit should call getContracts and getContractProgress', () => {
        component.ngOnInit()
        expect(contractService.getContracts).toHaveBeenCalled()
        expect(progressService.getContractProgress).toHaveBeenCalled()
    })

    it('filteredContracts should return all contracts when no filter applied', () => {
        component.ngOnInit()
        expect(component.filteredContracts().length).toBe(2)
    })

    it('filteredContracts should filter contracts by name after debounce', () => {
        vi.useFakeTimers()
        contractsSignal.set(mockContracts)
        component.filterForm.get('search')!.setValue('Alpha')
        vi.advanceTimersByTime(600)
        expect(component.filteredContracts().length).toBe(1)
        expect(component.filteredContracts()[0].name).toBe('Alpha Contract')
        vi.useRealTimers()
    })

    it('filteredContracts should return empty when name does not match', () => {
        vi.useFakeTimers()
        contractsSignal.set(mockContracts)
        component.filterForm.get('search')!.setValue('Nonexistent')
        vi.advanceTimersByTime(600)
        expect(component.filteredContracts().length).toBe(0)
        vi.useRealTimers()
    })

    it('openContract() should navigate to the contract editor route', () => {
        component.openContract(mockContracts[0])
        expect(router.navigate).toHaveBeenCalledWith(['/contracts/contract-1'])
    })

    it('tagSelectableItems should collect unique tags from all contracts', () => {
        contractsSignal.set(mockContracts)
        const items = component.tagSelctableItems()
        expect(items.length).toBe(1)
        expect(items[0].name).toBe('Legal')
    })

    it('progressMap should map contract_id to its progress', () => {
        progressService.progress.set(mockProgress)
        const map = component.progressMap()
        expect(map.get('contract-1')?.progress.total).toBe(10)
        expect(map.get('contract-1')?.progress.labelled).toBe(4)
    })
})
