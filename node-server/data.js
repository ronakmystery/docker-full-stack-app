// globalState.js
let globalState = {
    subscriptions: new Map(), 
    connectedUsers: new Set(),    
    messages:[],
    tasks: [
      { id: 1, userId: null, task_name: "Task 1", },
      { id: 2, userId: null, task_name: "Task 2", },
      
  ]
  };
  
  module.exports=globalState