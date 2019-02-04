import {Component} from '@angular/core';
import {DocumentReference} from 'angularfire2/firestore';

export interface Formula {
  approved: boolean;
  approvedOn: Date;
  components: {component: Component; quantity: number}[];
  createdOn: Date;
  id: string;
  name: string;
  ref: DocumentReference;
}
