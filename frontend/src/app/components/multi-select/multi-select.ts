import { Component, computed, effect, ElementRef, HostListener, input, model, output, signal, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export interface SelectableItem {
    id: string
    name: string
}

@Component({
    selector: 'multi-select',
    templateUrl: './multi-select.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: MultiSelect,
        multi: true
    }]
})
export class MultiSelect implements ControlValueAccessor {
    items = input.required<SelectableItem[]>()
    selected = signal<SelectableItem[]>([])
    limit = input<number>(-1)
    query = model<string>('')
    selectedItems = signal<SelectableItem[]>([])
    focused = signal<boolean>(false)
    selectedSet = computed(() => new Set(this.selectedItems().map(item => item.id)))

    createItem = output<string>()
    refreshItems = output<void>()

    private onChange = (val: SelectableItem[]) => {}
    private onTouch = () => {}

    @ViewChild('searchInput') searchInput!: ElementRef

    constructor(private elRef: ElementRef) {
        // swap out optimistic addition with latest data
        effect(() => {
            const latest = this.items()
            this.selectedItems.update(selected =>
                selected.map(s =>
                    s.id.startsWith('__temp__')
                        ? (latest.find(i => i.name === s.name) ?? s)
                        : s
                )
            )
            this.onChange(this.selectedItems())
        })
    }

    ngOnInit() {
        this.selectedItems.set(this.selected())
    }

    filteredItems = computed(() => {
        if (!this.query()) {
            return this.items()
        }
        return this.items().filter(item => item.name.toLowerCase().includes(this.query().toLowerCase()))
    })

    hasExactMatch = computed(() =>
        this.items().some(i => i.name.toLowerCase() === this.query().trim().toLowerCase())
    )

    selectItem(item: SelectableItem) {
        if (this.limit() > 0 && this.selectedItems().length >= this.limit()) {
            return
        }
        this.selectedItems.update(items => [...items, item])
        this.onChange(this.selectedItems())
    }

    removeItem(item: SelectableItem) {
        this.selectedItems.update(items => items.filter(i => i !== item))
    }

    updateQuery(event: Event) {
        const target = event.target as HTMLInputElement
        this.query.set(target.value)
    }

    toggleItem(item: SelectableItem) {
        this.selectedSet().has(item.id) ? this.removeItem(item) : this.selectItem(item)
    }

    focusInput() {
        this.focused.set(true)
        this.refreshItems.emit()
        setTimeout(() => this.searchInput?.nativeElement?.focus(), 0)
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (!this.elRef.nativeElement.contains(event.target)) {
            this.focused.set(false)
            this.query.set('')
        }
    }

    onEnter(event: KeyboardEvent) {
        if (event.key !== 'Enter') return
        const name = this.query().trim()
        if (!name || this.hasExactMatch()) return

        // Optimistic: add
        this.selectItem({ id: `__temp__${name}`, name })
        this.query.set('')

        // Parent create item
        this.createItem.emit(name)
    }

    writeValue(val: SelectableItem[]): void {
        this.selected.set(val ?? [])
    }

    registerOnChange(fn: any): void {
        this.onChange = fn
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn
    }
}