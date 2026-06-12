import { Component, computed, input, model, signal } from "@angular/core";

interface SelectableItem {
    id: string
    name: string
}

@Component({
    selector: 'multi-select',
    templateUrl: './multi-select.html'
})
export class MultiSelect {
    items = input<SelectableItem[]>([]);
    query = model<string>('')
    selectedItems = signal<SelectableItem[]>([])
    selectedSet = computed(() => new Set(this.selectedItems().map(item => item.id)))

    filteredItems = computed(() => {
        if (!this.query()) {
            return this.items()
        }
        return this.items().filter(item => item.name.toLowerCase().includes(this.query().toLowerCase()))
    })

    selectItem(item: SelectableItem) {
        console.log("calling select item")
        this.selectedItems.update(items => [...items, item])
    }

    removeItem(item: SelectableItem) {
        console.log("calling remove item")
        this.selectedItems.update(items => items.filter(i => i !== item))
    }

    updateQuery(event: Event) {
        const target = event.target as HTMLInputElement
        this.query.set(target.value)
    }

    toggleItem(item: SelectableItem) {
        this.selectedSet().has(item.id) ? this.removeItem(item) : this.selectItem(item)
    }
}