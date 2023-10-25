import { TaskResponseInterface } from './task-response-interface';
export interface GroupedTasks {
  id : number;
  name : string;
  tasks : TaskResponseInterface [] ;
}
