import {DocumentReference} from 'angularfire2/firestore';
import {SafeUrl, SafeHtml} from '@angular/platform-browser';

export interface Product {
  category: string;
  currency: 'CAD' | 'USD';
  description: SafeHtml;
  files: {name: string; link: string; type: string}[];
  id: string;
  image: SafeUrl;
  name: string;
  originalDescription: string;
  originalImage: string;
  price: number;
  ref: DocumentReference;
  weight: number;
}
