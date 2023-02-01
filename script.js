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
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=7') //URL QUERY ?_limit=7 sätter en gräns på vår data så bara 7 todos laddas in
    .then(res => res.json())
    .then(data => {
        // console.log(data)
        data.forEach(todo => {
            todos.push(todo)
        })
        
        listTodos()
    })  
}

getTodos()


//Funktion som listar alla todos för kör funktion som skapar ett todo-element för varje todo i listan, skrivs sedan ut i DOMEN
const listTodos = () => {
    todos.forEach(todo => {
        const todoElement = createTodos(todo)
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

    //Lägger till en Eventlistenener på mitt todo-item. När knappen trycks körs en PATCH
    todoItem.addEventListener('click', e => {
        
        //Hämtar URL + id från alla todos, lägger sedan till en en funktion som ger möjlighet att toggla fram och tillbaka mellan klar och oklar
        fetch(BASE_URL + todo.id, {
            method: 'PATCH',
            body:JSON.stringify({completed:!todo.completed}), //Vi hämtar det completed (t.ex true) som vårt element inte har (false)
            headers:{
            'Content-type': 'application/json; charset=UTF-8', //Talar om för datorna att vi hämtar JSON
            },
        })
        //sedan när vi får tillbaka datan lägger vi till så att data och todo ska se likadana ut
        
        .then(res => res.json())
        .then (data => {
            todo.completed = data.completed
            //lägger till klassen 'checked' som vi nu kan toggla fram och tillbaka emellan klar och oklar när vi klickar på todoItem
            todoItem.classList.toggle('checked') 
        }) 
     
    })
    
    let deleteBtn = document.createElement('button')
    deleteBtn.className = 'close'
    deleteBtn.innerText = 'X'
    
    //Funktion för delete-knappen
    deleteBtn.addEventListener('click', e => {
        //Om en todo INTE är complete 
        if(!todo.completed){
            
            //Stoppar funktionen efter 'clicket' struntar i eventlistern på DIVEN A.K.A delete händer inte. Tar också bort display-none på modal
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
    //Funktion som ger stängknappen på modalen- och kan ta bort den så den inte syns
    closeBtn.addEventListener ('click', e => {
   if(e.target == closeBtn) {
    modal.classList.add('display-none')
   }
   if(e.target == window) {
    modal.classList.add('display-none');
   }
})

    //lägger till nya element efter förekommande element => t.ex todoList är förälder till todoItem 
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
    

    //Skapar ny todo med det vi skriver in i inputen och lägger till completed: false som default
    const newTodo = {
        id: crypto.randomUUID(),
        title: document.querySelector('#todo-input').value,
        completed: false
    }

    if(!validateInput()) {
        // console.log('valideringsfel')
        return
    }
    //Vi talar om att vi vill posta vår nya todo för databasen
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
        console.log(todos)
        todoList.appendChild(todoElement);
        input.reset()
    });

}


//Kör submit-funktion
input.addEventListener('submit', handleSubmit);