import { Component, OnInit } from '@angular/core';
import { TreeDataService } from '../../services/tree-data.service'
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ItemNode } from 'src/app/models/item-node';
import { ItemFlatNode } from 'src/app/models/item-flat-node';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
    
    public treeData = this._treeDataService.formatData();
    public dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;
    public treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;
    public treeControl: FlatTreeControl<ItemFlatNode>;
    public checklistSelection = new SelectionModel<ItemFlatNode>(true);

    public flatNodeMap = new Map<ItemFlatNode, ItemNode>();
    public nestedNodeMap = new Map<ItemNode, ItemFlatNode>();

    constructor(
        private _treeDataService: TreeDataService
    ) {
        this.treeFlattener = new MatTreeFlattener<ItemNode, ItemFlatNode>(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<ItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }

    public ngOnInit() {
        this.dataSource.data = this.treeData;
        let hasStoredSelection = this.rememberSelection();
        if (hasStoredSelection) {
            this.restoreSelection(hasStoredSelection);
        }
    }

    public transformer(node: ItemNode, level: number) {
        const existingNode = this.nestedNodeMap ? this.nestedNodeMap.get(node) : null;
        const flatNode = existingNode && existingNode.name === node.name
            ? existingNode
            : new ItemFlatNode();
        flatNode.id = node.id;
        flatNode.name = node.name;
        flatNode.level = level;
        flatNode.expandable = !!node.children.length;
        this.flatNodeMap ? this.flatNodeMap.set(flatNode, node) : null;
        this.nestedNodeMap ? this.nestedNodeMap.set(node, flatNode) : null;
        return flatNode;
    }

    public getLevel(node: ItemFlatNode) {
        return node.level;
    }

    public isExpandable(node: ItemFlatNode) {
        return node.expandable;
    }

    public getChildren(node: ItemNode) {
        return node.children;
    }

    public hasChild(_:number, _nodeData: ItemFlatNode) {
        return _nodeData.expandable;
    }

    public todoItemSelectionToggle(node: ItemFlatNode, event: MatCheckboxChange): void {
        this.checklistSelection.toggle(node);
        console.log(this.checklistSelection);

        const descendants = this.treeControl.getDescendants(node);
        if (this.checklistSelection.isSelected(node)) {
            this.checklistSelection.select(...descendants)
        } else {
            event.source.checked = false;
            this.checklistSelection.deselect(...descendants);
        }
        // Force update for the parent
        descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        this.checkAllParentsSelection(node);
        this.storeSelection(this.checklistSelection.selected);
    }

    public descendantsAllSelected(node: ItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
          this.checklistSelection.isSelected(child)
        );
        return descAllSelected;
    }

    public descendantsPartiallySelected(node: ItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    public todoLeafItemSelectionToggle(node: ItemFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);

        this.storeSelection(this.checklistSelection.selected);
    }

    public checkAllParentsSelection(node: ItemFlatNode): void {
        let parent: ItemFlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    public getParentNode(node: ItemFlatNode): ItemFlatNode | null {


        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

    public checkRootNodeSelection(node: ItemFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllUnselected = descendants.every(child =>
            !this.checklistSelection.isSelected(child)
        );
        const descHasSelected = descendants.find(child =>
            this.checklistSelection.isSelected(child)
        );
        if (nodeSelected && descAllUnselected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descHasSelected) {
            this.checklistSelection.select(node);
        }
    }

    public storeSelection(selection) {
        localStorage.setItem('selectedNodes', JSON.stringify(selection));
    }

    public rememberSelection(): ItemFlatNode[] {
        return JSON.parse(localStorage.getItem('selectedNodes'));
    }

    public restoreSelection(oldSelection: ItemFlatNode[]) {
        oldSelection.map(oldNode => {
            const node = this.treeControl.dataNodes.find(item => item.id === oldNode.id);
            if (node) {
                this.checklistSelection.select(node);
            }
        })
    }

    public removeStorage() {
        localStorage.removeItem('selectedNodes');
    }
}