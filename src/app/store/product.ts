import {DocumentReference} from 'angularfire2/firestore';
import {SafeUrl, SafeHtml} from '@angular/platform-browser';

export interface Product {
  category: string;
  currency: 'CAD' | 'USD';
  description: SafeHtml;
  files: {link: string; type: string}[];
  id: string;
  image: SafeUrl;
  name: string;
  price: number;
  ref: DocumentReference;
  weight: number;
}
