const BASE_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=7'
const todos = [];

const input = document.querySelector('#input')
const submit = document.querySelector('.add-button')

const output = document.querySelector('.output');
const todoList = document.querySelector('.todo-list');
const todoItem = document.querySelector('.todo-item');


//Funktion som hämtar alla todos och pushar in dem i en tom Array
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


//Funktion som listar alla todos för kör funktion som skapar ett todo-element för varje todo i listan, skrivs sedan ut i DOMEN
const listTodos = () => {
    todoList.innerText = ''
    todos.forEach(user => {
        // console.log(user)
        const todoElement = createTodos(user)
        todoList.appendChild(todoElement)
        
    })

}


//Funktion som skapar alla element för todos innan de listas i DOMEN
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


    todoList.append(todoItem)
    todoItem.append(deleteBtn)

    return todoItem
} 
//Validerar formulär och kollar om input är tom eller inte- kör error message om den är tom
const validateInput = e => {
        
    const textInput = document.querySelector('#todo-input');
    const errorMessage = document.querySelector('#error-message');

    if(textInput.value() === '' ) {
        errorMessage.classList.remove('display-none')
        return false
    }

    errorMessage.classList.add('display-none')
    return true
    
}

//Funktion som lägger till en ny TODO
const handleSubmit = e =>{
    e.preventDefault()
    

    const newTodo = {
        id: crypto.randomUUID(),
        title: document.querySelector('#todo-input').value,
        completed: false
    }

    if(!validateInput()) {
        // console.log('valideringsfel')
        return
    }

    fetch(BASE_URL, {
        method:'POST',
        body:JSON.stringify(newTodo),
        headers:{
        'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
    .then((data) => {
        const todoElement = createTodos(data)
      todos.push(data)
        todoList.appendChild(todoElement);
    });

}

const removeTodo = e => {
    if(!e.target.classList.contains('close')){
        console.log('klickade inte på knappen')
    return
    }

    fetch(BASE_URL + e.target.id, {
        method: 'DELETE',
    })
    .then(res => {
        console.log(res)
        if(res.ok){
            e.target.remove()
            const index = todos.findIndex(user => user.id == e.target.id)
            todos.splice(index, 1)
            console.log(todos)
        }
    })
} 




input.addEventListener('submit', handleSubmit);
todoList.addEventListener('click', removeTodo);