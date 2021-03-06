class Tasks {
  constructor() {
    this.tasks = []
    this.initBindingsAndEventListeners()
    this.adapter = new TasksAdapter()
    this.fetchAndLoadTasks()
  }
  

  initBindingsAndEventListeners() {
    
      let form = document.getElementById('new-task-form')
      form.innerHTML = "<input type='text' name='newTask' id ='newTask'>" + "</br>" +"<input type='submit'>"  
     
      var container = document.querySelector('div.container')
      // var newTask = document.getElementById('newTask').value
      var newDiv = document.createElement('div')
      // newDiv.className = 'tasks-container'
      newDiv.setAttribute("id", "tasks-container")
      container.appendChild(newDiv)
      var newLi = document.createElement('li')
      newLi.className = 'notes-list'
      newDiv.appendChild(newLi)
    
    
    this.tasksForm = document.getElementById('new-task-form') //task form
    this.taskInput = document.getElementById('newTask') //name of task
    this.tasksNode = document.getElementById('tasks-container') // task list
    this.tasksForm.addEventListener('submit',this.handleAddtask.bind(this))
    this.tasksNode.addEventListener('click',this.handleDeletetask.bind(this))
    this.tasksNode.addEventListener('click',this.handleEditTask.bind(this))

  }
  

  fetchAndLoadTasks() {
    this.adapter.getTasks()
    .then( tasksJSON => tasksJSON.forEach( task => this.tasks.push( new Task(task) )))
      .then( this.render.bind(this) )
      .catch( (error) => console.log(error) )
  }

  handleAddtask() {
    event.preventDefault()
    const name = this.taskInput.value
    this.adapter.createTask(name)
    .then( (taskJSON) => this.tasks.push(new Task(taskJSON)) )
    .then(  this.render.bind(this) )
    .then( () => this.taskInput.value = '' )
  }
  handleEditTask(){
    event.preventDefault()
    if (event.target.dataset.action === 'edit-task') {
        
      const taskId = event.target.parentElement.dataset.taskid
      var newTask = document.getElementById(taskId).innerText
        // this.adapter.editTaskForm(taskId)
        
    this.adapter.editTask(taskId, newTask)
    
    
    }
  }

  handleDeletetask() {
    
    event.preventDefault()
    if (event.target.dataset.action === 'delete-task' ) {
      
      const taskId = event.target.parentElement.dataset.taskid
      this.adapter.deletetask(taskId)
      .then( resp => this.removeDeletedtask(resp) )
    }
  }

  removeDeletedtask(deleteResponse) {
    this.tasks = this.tasks.filter( task => task.id !== deleteResponse.taskId )
    this.render()
  }

  tasksHTML() {
      
    return this.tasks.map( task => task.render() ).join('')
  }

  render() {
    
    this.tasksNode.innerHTML = `<ul>${this.tasksHTML()}</ul>`
  }
 
}