import { TestBed } from '@angular/core/testing'
import { computed, signal } from '@angular/core'
import { of } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { ContractEditor } from './contract-editor'
import { ClauseService } from '../../services/clause.service'
import { LabelService } from '../../services/label.service'
import { ContractService } from '../../services/contract.service'
import { ContextService } from '../../services/context.service'
import { Clause, Paragraph } from '../../models/clause.model'
import { Label } from '../../models/label.model'
import { Contract } from '../../models/contract.model'

const mockContract: Contract = {
    id: 'contract-1',
    name: 'Test Contract',
    created_at: new Date(),
    updated_at: new Date(),
    tags: []
}

const mockLabel: Label = { id: 'label-1', name: 'Important' }

const mockClause: Clause = {
    id: 'clause-1',
    contract_id: 'contract-1',
    content: 'This is a test clause.',
    paragraph_number: 0,
    sentence_number: 0,
    label_id: null,
    created_at: new Date(),
    updated_at: new Date()
}

const mockParagraph: Paragraph = { paragraph_number: 0, clauses: [mockClause] }

describe('ContractEditor', () => {
    let component: ContractEditor
    let clausesSignal: ReturnType<typeof signal<Paragraph[]>>
    let labelsSignal: ReturnType<typeof signal<Label[]>>
    let clauseService: any
    let labelService: any
    let contractService: any
    let contextService: any

    beforeEach(async () => {
        clausesSignal = signal<Paragraph[]>([])
        labelsSignal = signal<Label[]>([])

        clauseService = {
            clauses: clausesSignal,
            currentProgress: computed(() => ({ total: 0, labelled: 0 })),
            getClauses: vi.fn(() => {
                clausesSignal.set([mockParagraph])
                return of([mockParagraph])
            }),
            updateClause: vi.fn(() => of({ ...mockClause, label_id: 'label-1' }))
        }
        labelService = {
            labels: labelsSignal,
            getLabels: vi.fn(() => {
                labelsSignal.set([mockLabel])
                return of([mockLabel])
            }),
            createLabel: vi.fn(() => of(mockLabel))
        }
        contractService = {
            contracts: signal<Contract[]>([]),
            getContracts: vi.fn(() => of([])),
            getContract: vi.fn(() => of(mockContract))
        }
        contextService = {
            contract: signal<Contract | null>(null),
            setContract: vi.fn(),
            clearContract: vi.fn()
        }

        await TestBed.configureTestingModule({
            imports: [ContractEditor],
            providers: [
                { provide: ClauseService, useValue: clauseService },
                { provide: LabelService, useValue: labelService },
                { provide: ContractService, useValue: contractService },
                { provide: ContextService, useValue: contextService },
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue('contract-1') } } }
                }
            ]
        }).compileComponents()

        component = TestBed.createComponent(ContractEditor).componentInstance
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('ngOnInit should fetch clauses and labels for the contract', () => {
        component.ngOnInit()
        expect(clauseService.getClauses).toHaveBeenCalledWith('contract-1')
        expect(labelService.getLabels).toHaveBeenCalled()
    })

    it('ngOnInit should fetch contract data when not already in context', () => {
        component.ngOnInit()
        expect(contractService.getContract).toHaveBeenCalledWith('contract-1')
    })

    it('ngOnInit should skip fetching contract when already in context', () => {
        contextService.contract.set(mockContract)
        component.ngOnInit()
        expect(contractService.getContract).not.toHaveBeenCalled()
    })

    it('selectClause() should patch form empty when clause has no label', () => {
        labelsSignal.set([mockLabel])
        component.selectClause(mockClause) // label_id: null
        expect(component.clauseForm.value.labels).toEqual([])
    })

    it('selectClause() should patch form with matching label when clause has a label', () => {
        labelsSignal.set([mockLabel])
        const labeledClause: Clause = { ...mockClause, label_id: 'label-1' }
        component.selectClause(labeledClause)
        expect(component.clauseForm.value.labels).toEqual([mockLabel])
    })

    it('onSubmit() should call updateClause with selected clause and label', () => {
        component.selectClause(mockClause)
        component.clauseForm.patchValue({ labels: [mockLabel] })

        component.onSubmit({ preventDefault: vi.fn() } as unknown as MouseEvent)

        expect(clauseService.updateClause).toHaveBeenCalledWith({
            ...mockClause,
            label_id: 'label-1'
        })
    })

    it('onSubmit() should call updateClause with null label_id when no label selected', () => {
        component.selectClause(mockClause)
        component.clauseForm.patchValue({ labels: [] })

        component.onSubmit({ preventDefault: vi.fn() } as unknown as MouseEvent)

        expect(clauseService.updateClause).toHaveBeenCalledWith({
            ...mockClause,
            label_id: null
        })
    })

    it('toggleFilterLabel() should set the filter to the given label', () => {
        component.toggleFilterLabel('label-1')
        expect(component.selectedFilterLabel()).toBe('label-1')
    })

    it('toggleFilterLabel() should clear the filter when the same label is toggled again', () => {
        component.toggleFilterLabel('label-1')
        component.toggleFilterLabel('label-1')
        expect(component.selectedFilterLabel()).toBeNull()
    })

    it('toggleFilterLabel() should switch to a different label', () => {
        component.toggleFilterLabel('label-1')
        component.toggleFilterLabel('label-2')
        expect(component.selectedFilterLabel()).toBe('label-2')
    })

    it('usedLabelsWithCounts() should count clauses per label', () => {
        labelsSignal.set([mockLabel])
        clausesSignal.set([{
            paragraph_number: 0,
            clauses: [
                { ...mockClause, id: 'c1', label_id: 'label-1' },
                { ...mockClause, id: 'c2', label_id: 'label-1' },
                { ...mockClause, id: 'c3', label_id: null }
            ]
        }])

        const result = component.usedLabelsWithCounts()
        expect(result.length).toBe(1)
        expect(result[0].id).toBe('label-1')
        expect(result[0].name).toBe('Important')
        expect(result[0].count).toBe(2)
    })
})
