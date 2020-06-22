import { TestBed, ComponentFixture } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { MatTreeModule } from '@angular/material/tree'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { TreeComponent } from './tree.component'
import { ItemFlatNode } from 'src/app/models/item-flat-node'
import { of } from 'rxjs'

fdescribe('TreeComponent', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;
  let joc = jasmine.objectContaining;

  const itemNode = {
    children: [],
    id: 'test',
    level: 0,
    name: 'Test Name'
  };

  const flatNode: ItemFlatNode = {
    id: 'test',
    name: 'Test Name',
    level: 0,
    expandable: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TreeComponent
      ],
      imports: [
        CommonModule,
        MatTreeModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should transform a regular node into a flat node', () => {

    const returnedNode = component.transformer(itemNode, itemNode.level);

    expect(returnedNode).toEqual(joc(flatNode));
  });

  it('should get the level of the flat node', () => {
    const returnedLevel = component.getLevel(flatNode);

    expect(returnedLevel).toBe(flatNode.level);
  });

  it('should get if the node is expandable', () => {
    const isExpandable = component.isExpandable(flatNode);

    expect(isExpandable).toBe(flatNode.expandable);
  });

  it('should get the children of the node', () => {
    const returnedChildren = component.getChildren(itemNode);

    expect(returnedChildren).toBe(itemNode.children);
  })

  it('should store an object correctly into "selectedNodes"', () => {
    spyOn(window.localStorage, 'setItem');
    const selection = [itemNode];

    component.storeSelection(selection);

    expect(window.localStorage.setItem).toHaveBeenCalledWith('selectedNodes', JSON.stringify(selection))
    expect(window.localStorage.getItem('selectedNodes')).toEqual(JSON.stringify(selection));
  })

  it("should remember the selected nodes correctly", () =>  {
    const selection = [itemNode];
    spyOn(window.localStorage, 'setItem');
    spyOn(window.localStorage, 'getItem').and.returnValue(JSON.stringify(selection));

    component.storeSelection(selection);
    const returnedSelection = component.rememberSelection();

    expect(window.localStorage.setItem).toHaveBeenCalledWith('selectedNodes', JSON.stringify(selection));
    expect(window.localStorage.getItem).toHaveBeenCalledWith('selectedNodes');
    expect(returnedSelection).toEqual(joc(selection));
  });
})
