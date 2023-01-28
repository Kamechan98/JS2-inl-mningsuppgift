const BASE_URL = 'https://jsonplaceholder.typicode.com/todos'
const todos = [];

const input = document.querySelector('.input')

const output = document.querySelector('.output');
const todoList = document.querySelector('.todo-list');
const todoItem = document.querySelector('.todo-item');


const getTodos = async () => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        data.forEach(user => {
            todos.push(user)
        })
        
        listTodos()
    })  
}

getTodos()



const listTodos = () => {
    todoList.innerText = ''
    todos.forEach(user => {
        console.log(user)
        const todoElement = createTodos(user)
        todoList.appendChild(todoElement)
        
    })

}



const createTodos = (user) => {

    let todoList = document.createElement('div')
    todoList.classList.add = 'todo-list'

    let todoItem = document.createElement('p', 'button')
    // user.title = user.title
    todoItem.innerText = user.title
    todoItem.classList = 'todo-item'
    

    let deleteBtn = document.createElement('button')
    deleteBtn.className = 'close'
    deleteBtn.innerText = 'X'


    // todoItem.appendChild(todoList)
    // todoItem.append(todoItem)
    todoItem.append(deleteBtn)

    return todoItem
} 


// const addTodo = (data) => {

// }
