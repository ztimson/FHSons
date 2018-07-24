import {DocumentReference} from 'angularfire2/firestore';

export interface Component {
  cost: number;
  created: Date;
  description: string;
  id: string;
  name: string;
  ref: DocumentReference;
}
