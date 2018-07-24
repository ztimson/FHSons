import {DocumentReference} from 'angularfire2/firestore';
import {SafeUrl} from '@angular/platform-browser';

export interface Category {
  image: SafeUrl;
  id: string;
  name: string;
  parent: string;
  ref: DocumentReference;
}
