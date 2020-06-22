import { Injectable } from "@angular/core";


@Injectable({ providedIn: 'root' })
export class TreeDataService {

  public formatData(data) {
    let list = Object.keys(data);
    let newData = [];

    list.forEach(item => {
      this.checkChild(data[item])
      newData.push(data[item]);
    });

    return newData;
  }

  public checkChild(child) {
    let childrenKeys = Object.keys(child.children);
    let childrenArray = [];
    if (childrenKeys.length > 0) {
      childrenKeys.forEach(childKey => {
        this.checkChild(child.children[childKey]);
        childrenArray.push(child.children[childKey]);
      });
    }
    child.children = childrenArray;
  }

}