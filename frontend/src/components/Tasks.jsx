import { useState, useRef, useEffect } from "react";

import { Notifications } from "./Notifications.jsx";

function Tasks({ user, socket }) {
    console.log(user)
  const [tasks, setTasks] = useState([]);

  socket.current?.on("tasks", (data) => {
    console.log("Received tasks from server:", data);
    setTasks(data);
  });

  let claimTask = (taskId) => {
    socket.current.emit("claimTask", { taskId,user });
  };

  return (
    <div id="tasks">
      Tasks
      <ul>
        {tasks.map((task) => (  
          <button key={task.id} 
          onClick={() => claimTask(task.id)}
          >
            {task.userId ? 
            
            task.userId==user.id?"unclaim":"claimed"

            : task.task_name}

            {task.task_name}
          </button>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
