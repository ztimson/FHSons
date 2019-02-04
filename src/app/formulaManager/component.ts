import {DocumentReference} from 'angularfire2/firestore';

export interface Component {
  price: number;
  createdOn: Date;
  description: string;
  id: string;
  name: string;
  ref: DocumentReference;
}
