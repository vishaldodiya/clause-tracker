import { TestBed } from '@angular/core/testing'
import { signal } from '@angular/core'
import { of } from 'rxjs'
import { ContractCreate } from './contract-create'
import { ContractService } from '../../services/contract.service'
import { TagService } from '../../services/tag.service'
import { Contract } from '../../models/contract.model'
import { Tag } from '../../models/tag.model'

const mockContract: Contract = {
    id: 'contract-1',
    name: 'Test Contract',
    created_at: new Date(),
    updated_at: new Date(),
    tags: []
}

describe('ContractCreate', () => {
    let component: ContractCreate
    let contractService: { contracts: ReturnType<typeof signal<Contract[]>>; getContracts: ReturnType<typeof vi.fn>; createContract: ReturnType<typeof vi.fn> }
    let tagService: { tags: ReturnType<typeof signal<Tag[]>>; getTags: ReturnType<typeof vi.fn>; createTag: ReturnType<typeof vi.fn> }

    beforeEach(async () => {
        contractService = {
            contracts: signal<Contract[]>([]),
            getContracts: vi.fn(() => of([])),
            createContract: vi.fn(() => of(mockContract))
        }
        tagService = {
            tags: signal<Tag[]>([]),
            getTags: vi.fn(() => of([])),
            createTag: vi.fn(() => of({ id: 'tag-1', name: 'Legal', created_at: new Date() }))
        }

        await TestBed.configureTestingModule({
            imports: [ContractCreate],
            providers: [
                { provide: ContractService, useValue: contractService },
                { provide: TagService, useValue: tagService }
            ]
        }).compileComponents()

        component = TestBed.createComponent(ContractCreate).componentInstance
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('openDialog() should open the dialog', () => {
        component.openDialog()
        expect(component.isOpen()).toBe(true)
    })

    it('closeDialog() should close the dialog', () => {
        component.openDialog()
        component.closeDialog()
        expect(component.isOpen()).toBe(false)
    })

    it('form should be invalid when name is empty', () => {
        expect(component.isFormValid()).toBe(false)
    })

    it('form should be invalid when name is provided but no file', () => {
        component.contractForm.setValue({ name: 'My Contract', tags: [] })
        expect(component.isFormValid()).toBe(false)
    })

    it('should set fileError when no file is selected', () => {
        const event = { target: { files: [] } } as unknown as Event
        component.onFileChange(event)
        expect(component.fileError()).toBe('File is required')
    })

    it('should reject unsupported file extensions', () => {
        const event = { target: { files: [new File(['x'], 'doc.pdf', { type: 'application/pdf' })] } } as unknown as Event
        component.onFileChange(event)
        expect(component.fileError()).toBe('Only .txt and .md files are supported')
        expect(component.selectedFile()).toBeNull()
    })

    it('should accept .txt files', () => {
        const event = { target: { files: [new File(['hello'], 'doc.txt', { type: 'text/plain' })] } } as unknown as Event
        component.onFileChange(event)
        expect(component.fileError()).toBeNull()
        expect(component.selectedFile()).not.toBeNull()
    })

    it('should accept .md files', () => {
        const event = { target: { files: [new File(['# Title'], 'contract.md', { type: 'text/markdown' })] } } as unknown as Event
        component.onFileChange(event)
        expect(component.fileError()).toBeNull()
        expect(component.selectedFile()).not.toBeNull()
    })

    it('should call createContract on valid submit', () => {
        component.contractForm.setValue({ name: 'My Contract', tags: [] })
        const fileEvent = { target: { files: [new File(['content'], 'doc.txt', { type: 'text/plain' })] } } as unknown as Event
        component.onFileChange(fileEvent)

        component.onSubmit({ preventDefault: vi.fn() } as unknown as MouseEvent)

        expect(contractService.createContract).toHaveBeenCalled()
    })

    it('should not call createContract when name is missing', () => {
        component.onSubmit({ preventDefault: vi.fn() } as unknown as MouseEvent)
        expect(contractService.createContract).not.toHaveBeenCalled()
    })

    it('should not call createContract when file is missing', () => {
        component.contractForm.setValue({ name: 'My Contract', tags: [] })
        component.onSubmit({ preventDefault: vi.fn() } as unknown as MouseEvent)
        expect(contractService.createContract).not.toHaveBeenCalled()
    })

    it('should fetch tags on init', () => {
        component.ngOnInit()
        expect(tagService.getTags).toHaveBeenCalled()
    })
})
