import { TestBed } from '@angular/core/testing';
import { TreeDataService } from './tree-data.service';

const exampleJson = {
  "0": {
    "id": "49569f0a-5292-4476-94b2-68df51acebe2",
    "name": "Tim Roger Y.",
    "children": {
      "0": {
        "id": "c86a3b47-5369-4c75-ac5a-ed286d7faf9e",
        "name": "Andre Alfred Hermann",
        "children": {},
        "level": 1
      }
    },
    "level": 0
  }
};

const expectedData = [
  {
    children: [
      {
        children: [],
        id: "c86a3b47-5369-4c75-ac5a-ed286d7faf9e",
        level: 1,
        name: "Andre Alfred Hermann"
      }
    ],
    id: "49569f0a-5292-4476-94b2-68df51acebe2",
    level: 0,
    name: "Tim Roger Y."
  }
];

const expectedChild = expectedData[0].children;

describe('TreeDataService', () => {
  const joc = jasmine.objectContaining;

  let service: TreeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
    })

    service = TestBed.get(TreeDataService);
  })

  it('should format data from json correctly', () => {
    const formatedData = service.formatData(exampleJson);

    expect(formatedData).toEqual(joc(expectedData));
  });

  it('should transform child data to an array', () => {
    let testData = exampleJson[0];
    
    service.checkChild(testData);

    expect(testData.children).toEqual(joc(expectedChild));
  });
})