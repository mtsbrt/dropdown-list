import { NgModule } from "@angular/core";

import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TreeComponent } from './tree.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        TreeComponent
    ],
    imports: [
        CommonModule,
        MatTreeModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule
    ],
    exports: [
        TreeComponent
    ]
})
export class TreeModule { }