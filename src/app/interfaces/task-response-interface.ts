import { StatusTaskInterface } from './status-task-interface';
export interface TaskResponseInterface {
  id : number;
  title : string;
  description : string;
  category : string;
  status : number;
}
