import {Component} from '@angular/core';
import {DocumentReference} from 'angularfire2/firestore';

export interface Formula {
  approved: boolean;
  components: {component: Component; quantity: number}[];
  created: Date;
  id: string;
  name: string;
  ref: DocumentReference;
}
