import { TaskResponseInterface } from './task-response-interface';
import { StatusTaskInterface } from './status-task-interface';
export interface GroupedTasks {
  id : number;
  name : string;
  tasks : TaskResponseInterface [] ;
}
