const BASE_URL = 'https://jsonplaceholder.typicode.com/todos/'
const todos = [];

const input = document.querySelector('#input')
const submit = document.querySelector('.add-button')

const output = document.querySelector('.output');
const todoList = document.querySelector('.todo-list');
const todoItem = document.querySelector('.todo-item');

const modal = document.querySelector('#modal');
const closeBtn = document.querySelector('#modal-btn');

//Funktion som hämtar alla todos och pushar in dem i en tom Array
const getTodos = async () => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=7')
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
const createTodos = (todo) => {

    let todoList = document.createElement('div')
    todoList.classList.add = 'todo-list'

    let todoItem = document.createElement('p')
    todoItem.innerText = todo.title
    todoItem.classList = 'todo-item'
    if(todo.completed === true){
        todoItem.classList.add('checked')
    }

    todoItem.addEventListener('click', e => {
        
        fetch(BASE_URL + todo.id, {
            method: 'PATCH',
            body:JSON.stringify({completed:!todo.completed}),
            headers:{
            'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(res => res.json())
        .then (data => {
            todo.completed = data.completed
            todoItem.classList.toggle('checked')
        }) 
     
    })
    
    let deleteBtn = document.createElement('button')
    deleteBtn.className = 'close'
    deleteBtn.innerText = 'X'
    
    deleteBtn.addEventListener('click', e => {
        if(!todo.completed){
            
            //Stoppar funktionen efter 'clicket' struntar i eventlistern på DIVEN
            e.stopPropagation()
            modal.classList.remove('display-none')

            return 
        }

        fetch(BASE_URL + todo.id, {
            method: 'DELETE'
        })
        .then(res => {
            console.log(res)
            if(res.ok){
                todoItem.remove()
                console.log(todos.indexOf(todo))
                const index = todos.indexOf(todo)
                todos.splice(index, 1)
                console.log(todos)
            }
        })
    })

    todoList.append(todoItem)
    todoItem.append(deleteBtn)

    return todoItem
} 
//Validerar formulär och kollar om input är tom eller inte- kör error message om den är tom
const validateInput = e => {
        
    const textInput = document.querySelector('#todo-input');
    // const inputValue = input.value;
    const errorMessage = document.querySelector('#error-message');

    if(textInput.value.trim() === '' ) {
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

closeBtn.addEventListener ('click', e => {
   if(e.target == closeBtn) {
    modal.classList.add('display-none')
   }
})



input.addEventListener('submit', handleSubmit);