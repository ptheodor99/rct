import logo from './logo.svg';
import React, { useEffect } from 'react';
import './App.css';

var userData = {
	loggedIn: false,
	id: undefined,
	email: undefined,
};

function App() {
	useEffect(() => {
	window.addEventListener('load', createLogin);
	return () => {
			window.removeEventListener('load', createLogin);
		};
	}, []);
	return ("");
}

export default App;

function startSession(){
	var header = document.getElementById("header");
	var root = document.getElementById("root");
	root.innerHTML = "";
	
	var div = document.createElement("div");
	div.id = "firstPage";
	
	var h1 = document.createElement('h1');
	h1.innerHTML = "Incepe sa planifici cu SmartPlanning";
	div.appendChild(h1);
	root.appendChild(div);
	
	var button = document.createElement('button');
	button.id = "CreateHome";
	button.onclick = createHome;
	button.innerHTML = "Creeaza o casa";
	header.appendChild(button);
	
	button = document.createElement('button');
	button.id = "TodayTasks";
	button.innerHTML = "Sarcinile de azi";
	button.onclick = displayTodayPage;
	header.appendChild(button);
	
	button = document.createElement('button');
	button.id = "AllTasks";
	button.innerHTML = 'Toate sarcinile';
	button.onclick = createAllTasks;
	header.appendChild(button);
}

function displayTodayPage(){
	var root = document.getElementById("root");
	root.innerHTML = "";
	
	var divv = document.createElement('div');
	divv.id = "TodayTasksPage";
	
	var div = document.createElement('div');
	div.id = "chooseHomeContainer";
	
	var select = document.createElement('select');
	select.id = "chooseHome";
	select.onchange = displayTodayTasks;
	div.appendChild(select);
	
	divv.appendChild(div);
	
	div = document.createElement('div');
	div.id = "TodayTasksSubPage";
	
	divv.appendChild(div);
	
	root.appendChild(divv);
	
	displayHomesTodayTasks();
}

function displayTodayTasks(){
	var id = document.getElementById("chooseHome").value;
	
	var today = new Date();
	today = today.toLocaleString();
	today = today.split(',');
	today = today[0].split('.');
	
	today = today[2] + '-' + today[1] + '-' + today[0];
	
	
	var data = {
		id: id,
		today: today,
	};
	
	const apiUrl = 'https://185.27.135.185:3001/api/getTodayTasks';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
			
			var TodayTasksSubPage = document.getElementById("TodayTasksSubPage");
			TodayTasksSubPage.innerHTML = "";
			
			var h1 = document.createElement('h1');
			h1.innerHTML = 'Sarcinile de azi';
			TodayTasksSubPage.appendChild(h1);
			
			var table = document.createElement('table');
			
			var tr = document.createElement('tr');
			
			var th = document.createElement('th');
			th.innerHTML = 'Nume';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'Casa';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'La fiecare';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'Tip';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'Urmatoarea data';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'Actiune';
			tr.appendChild(th);
			
			table.appendChild(tr);
			
			for(var i = 0; i < data.length; i++){
				tr = document.createElement('tr');
				
				var td = document.createElement('td');
				td.innerHTML = data[i].name;
				tr.appendChild(td);
				
				td = document.createElement('td');
				td.innerHTML = data[i].homeName;
				tr.appendChild(td);
				
				td = document.createElement('td');
				td.innerHTML = data[i].number;
				tr.appendChild(td);
				
				td = document.createElement('td');
				td.innerHTML = data[i].type;
				tr.appendChild(td);
				
				td = document.createElement('td');
				var next = data[i].next;
				next = next.split('T');
				next = next[0].split('-');
				next = next[2] + '.' + next[1] + '.' + next[0];
				td.innerHTML = next;
				tr.appendChild(td);
				
				td = document.createElement('td');
				
				var button = document.createElement('button');
				button.value = data[i].id;
				button.onclick = commitTask;
				button.className = 'std-btn';
				button.innerHTML = 'Completat';
				td.appendChild(button);
				
				tr.appendChild(td);
				
				table.appendChild(tr);
			}
			
			
			TodayTasksSubPage.appendChild(table);
			
			displayOverdueTasks();
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function displayOverdueTasks(){
	var id = document.getElementById("chooseHome").value;
	
	var today = new Date();
	today = today.toLocaleString();
	today = today.split(',');
	today = today[0].split('.');
	
	today = today[2] + '-' + today[1] + '-' + today[0];
	
	
	var data = {
		id: id,
		today: today,
	};
	
	const apiUrl = 'https://185.27.135.185:3001/api/getOverdueTasks';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
			
			var TodayTasksSubPage = document.getElementById("TodayTasksSubPage");
			
			var h1 = document.createElement('h1');
			h1.innerHTML = 'Sarcini depasite';
			TodayTasksSubPage.appendChild(h1);
			
			var table = document.createElement('table');
			
			var tr = document.createElement('tr');
			
			var th = document.createElement('th');
			th.innerHTML = 'Nume';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'Casa';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'La fiecare';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'Tip';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'Urmatoarea data';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'Actiune';
			tr.appendChild(th);
			
			table.appendChild(tr);
			
			for(var i = 0; i < data.length; i++){
				tr = document.createElement('tr');
				
				var td = document.createElement('td');
				td.innerHTML = data[i].name;
				tr.appendChild(td);
				
				td = document.createElement('td');
				td.innerHTML = data[i].homeName;
				tr.appendChild(td);
				
				td = document.createElement('td');
				td.innerHTML = data[i].number;
				tr.appendChild(td);
				
				td = document.createElement('td');
				td.innerHTML = data[i].type;
				tr.appendChild(td);
				
				td = document.createElement('td');
				var next = data[i].next;
				next = next.split('T');
				next = next[0].split('-');
				next = next[2] + '.' + next[1] + '.' + next[0];
				td.innerHTML = next;
				tr.appendChild(td);
				
				td = document.createElement('td');
				
				var button = document.createElement('button');
				button.value = data[i].id;
				button.onclick = commitTask;
				button.className = 'std-btn';
				button.innerHTML = 'Completat';
				td.appendChild(button);
				
				tr.appendChild(td);
				
				table.appendChild(tr);
			}
			
			
			TodayTasksSubPage.appendChild(table);
			
			
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function commitTask(event){
	var id = event.target.value;
	
	var data = {
		id: id,
	};
	
	const apiUrl = 'https://185.27.135.185:3001/api/commitTask';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
			displayTodayTasks();
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function createAllTasks(){
	var root = document.getElementById("root");
	root.innerHTML = "";
	
	var divv = document.createElement('div');
	divv.id = "AllTasksContainer";
	
	var div = document.createElement('div');
	div.id = "chooseHomeContainer";
	
	var select = document.createElement('select');
	select.id = "chooseHome";
	select.onchange = displayAllTasks;
	
	
	div.appendChild(select);
	
	divv.appendChild(div);
	
	div = document.createElement('div');
	div.id = "createTask";
	
	var input = document.createElement('input');
	input.id = "TaskName";
	input.placeholder = "Nume...";
	input.type = "text"
	div.appendChild(input);
	
	input = document.createElement('input');
	input.id = "TaskNumber";
	input.placeholder = "Numar..."
	input.type = "text";
	div.appendChild(input);
	
	var select = document.createElement('select');
	select.id = "TaskType";
	
	
	var option = document.createElement('option');
	option.value = "zi";
	option.innerHTML = "Zi";
	select.appendChild(option);
	
	option = document.createElement('option');
	option.value = "saptamana";
	option.innerHTML = "Saptamana";
	select.appendChild(option);
	
	option = document.createElement('option');
	option.value = "luna";
	option.innerHTML = "Luna";
	select.appendChild(option);
	
	option = document.createElement('option');
	option.value = "an";
	option.innerHTML = "An";
	select.appendChild(option);
	
	div.appendChild(select);
	
	var button = document.createElement('button');
	button.onclick = addTask;
	button.innerHTML = "Adauga"
	
	div.appendChild(button);
	
	divv.appendChild(div);
	
	div = document.createElement('div');
	div.id = "AllTasksSubPage";
	
	divv.appendChild(div);
	
	root.appendChild(divv);
	displayHomesAllTasks();
	
}

function addTask(){
	var name = document.getElementById("TaskName").value;
	var number = document.getElementById("TaskNumber").value;
	var type = document.getElementById("TaskType").value;
	var houseId = document.getElementById("chooseHome").value;
	
	var data = {
		name: name,
		number: number,
		type: type,
		houseId: houseId,
	};
	
	document.getElementById("TaskName").value = "";
	document.getElementById("TaskNumber").value = "";
	document.getElementById("TaskType").value = "zi";
	
	const apiUrl = 'https://185.27.135.185:3001/api/addTask';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
			displayAllTasks();
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function displayHomesAllTasks(){
	var select = document.getElementById('chooseHome');
	select.innerHTML = "";
	
	var data = {
		UserId: userData.id,
	}
	
	const apiUrl = 'https://185.27.135.185:3001/api/displayHomesAllTasks';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
			
			for(var i = 0; i < data.length; i++){
				var option = document.createElement('option');
				option.value = data[i].id;
				option.innerHTML = data[i].name;
				select.appendChild(option);
			}	

			displayAllTasks();				
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function displayHomesTodayTasks(){
	var select = document.getElementById('chooseHome');
	select.innerHTML = "";
	
	var data = {
		UserId: userData.id,
	}
	
	const apiUrl = 'https://185.27.135.185:3001/api/displayHomesAllTasks';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
			
			for(var i = 0; i < data.length; i++){
				var option = document.createElement('option');
				option.value = data[i].id;
				option.innerHTML = data[i].name;
				select.appendChild(option);
			}	

			displayTodayTasks();			
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function displayAllTasks(){
	var AllTasksSubPage = document.getElementById("AllTasksSubPage");
	AllTasksSubPage.innerHTML = "";
	var HomeId = document.getElementById("chooseHome").value;
	
	var data = {
		UserId: userData.id,
		HomeId: HomeId,
	}
	
	const apiUrl = 'https://185.27.135.185:3001/api/displayAllTasks';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
			
			var table = document.createElement('table');
			
			var tr = document.createElement('tr');
			
			var th = document.createElement('th');
			th.innerHTML = 'Nume';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'Casa';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'La fiecare';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'Tip';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'Urmatoarea data';
			tr.appendChild(th);
			
			th = document.createElement('th');
			th.innerHTML = 'Actiune';
			tr.appendChild(th);
			
			table.appendChild(tr);
			
			for(var i = 0; i < data.length; i++){
				tr = document.createElement('tr');
				
				var td = document.createElement('td');
				td.innerHTML = data[i].name;
				tr.appendChild(td);
				
				td = document.createElement('td');
				td.innerHTML = data[i].homeName;
				tr.appendChild(td);
				
				td = document.createElement('td');
				td.innerHTML = data[i].number;
				tr.appendChild(td);
				
				td = document.createElement('td');
				td.innerHTML = data[i].type;
				tr.appendChild(td);
				
				td = document.createElement('td');
				var next = data[i].next;
				next = next.split('T');
				next = next[0].split('-');
				next = next[2] + '.' + next[1] + '.' + next[0];
				td.innerHTML = next;
				tr.appendChild(td);
				
				td = document.createElement('td');
				
				var button = document.createElement('button');
				button.value = data[i].id;
				button.onclick = deleteTask;
				button.className = 'std-btn';
				button.innerHTML = 'Sterge';
				td.appendChild(button);
				
				tr.appendChild(td);
				
				table.appendChild(tr);
			}
			
			AllTasksSubPage.appendChild(table);			
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function deleteTask(event){
	var id = event.target.value;
	
	var data = {
		TaskId: id,
	};
	
	const apiUrl = 'https://185.27.135.185:3001/api/deleteTask';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
			displayAllTasks();
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function createHome(){
	var root = document.getElementById("root");
	root.innerHTML = "";
	
	var divv = document.createElement('div');
	divv.id = "HomesPage";
	
	var div = document.createElement('div');
	div.id = "CreateHome";
	
	var input = document.createElement('input');
	input.id = "HomeName";
	input.type = "text";
	input.placeholder = "Nume...";
	div.appendChild(input);
	
	var button = document.createElement('button');
	button.id = "SubmitHome";
	button.innerHTML = "Creeaza casa";
	button.onclick = addHome;
	div.appendChild(button);
	
	divv.appendChild(div);
	
	
	div = document.createElement('div');
	div.id = "Homes";
	divv.appendChild(div);
	
	root.appendChild(divv);
	
	showHomes();
}

function addHome(){
	var name = document.getElementById("HomeName").value;
	
	if(name == ""){
		alert("Casa trebuie sa aiba un nume");
		return;
	}
	
	var data = {
		HomeName: name,
		UserId: userData.id,
	}
	
	const apiUrl = 'https://185.27.135.185:3001/api/addHome';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
			document.getElementById("HomeName").value = "";
			showHomes();
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function showHomes(){
	var data = {
		UserId: userData.id,
	}
	
	const apiUrl = 'https://185.27.135.185:3001/api/showHomes';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
			
			displayHomes(data);
			
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function displayHomes(data){
	var Homes = document.getElementById("Homes");
	Homes.innerHTML = "";
	
	for(var i = 0; i < data.length; i++){
		var div = document.createElement('div');
		div.id = "Home";
		
		var span = document.createElement("span");
		span.innerHTML = data[i].name;
		div.appendChild(span);
		
		var input = document.createElement("input");
		input.type = "text";
		input.placeholder = "Email...";
		input.id = data[i].id;
		div.appendChild(input);
		
		var button = document.createElement('button');
		button.value = data[i].id;
		button.innerHTML = 'Adauga utilizator';
		button.onclick = addUser;
		div.appendChild(button);
		
		Homes.appendChild(div);
	}
}

function addUser(event){
	var HomeId = event.target.value;
	var Email = document.getElementById(HomeId).value;
	document.getElementById(HomeId).value = "";
	
	var data = {
		HomeId: HomeId,
		Email: Email,
	};
	
	const apiUrl = 'https://185.27.135.185:3001/api/addUSerToHome';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function createLogin(){
	var root = document.getElementById("root");
	root.innerHTML = "";
	
	const div = document.createElement('div');
	div.id = 'LoginPage';
	
	const h1 = document.createElement('h1');
	h1.innerHTML = 'Logare in SmartPlanning';
	div.appendChild(h1);
	
	const form = document.createElement('form');
	form.id = 'LoginForm';
	form.onsubmit = collectLogin;
	
	var input = document.createElement('input');
	input.type = 'text';
	input.id = 'email';
	input.placeholder = 'Email...';
	input.onkeyup = validateLogin;
	form.appendChild(input);
	
	input = document.createElement('input');
	input.type = 'password';
	input.id = 'pass';
	input.placeholder = 'Password...';
	input.onkeyup = validateLogin;
	form.appendChild(input);
	
	const span = document.createElement('span');
	span.id = "err";
	form.appendChild(span);
	
	const buttons = document.createElement('div');
	buttons.id = "buttons";
	
	var button = document.createElement('button');
	button.type = 'button';
	button.id = 'NoAccount';
	button.onclick = createRegister;
	button.innerHTML = 'Nu am cont';
	buttons.appendChild(button);
	
	button = document.createElement('button');
	button.type = 'submit';
	button.id = 'SubmitLogin';
	button.innerHTML = 'LogIn';
	buttons.appendChild(button);
	
	
	
	form.appendChild(buttons);
	
	div.appendChild(form);
	
	root.appendChild(div);
	
	validateLogin();
}

function collectLogin(event){
	event.preventDefault();
	
	var email = document.getElementById("email").value;
	var pass = document.getElementById("pass").value;
	
	var data = {
		email: email,
		pass: pass,
	}
	
	const apiUrl = 'https://185.27.135.185:3001/api/login';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
			
			if(data.response == true){
				console.log("Loghez..");
				userData.loggedIn = true;
				userData.email = data.email;
				userData.id = data.id;
				
				startSession();
			}
			else{
				document.getElementById("err").innerHTML = "Date de logare invalide";
			}
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function validateLogin(){
	if(document.getElementById("err").innerHTML != "Date de logare invalide"){
	
		var err = "";
		
		var email = document.getElementById("email").value;
		var pass = document.getElementById("pass").value;
		
		if(email == "" || pass == "")
			err = "Toate campurile trebuie completate";
		else
			err = "";
		
		var SubmitLogin = document.getElementById("SubmitLogin");
		
		if(err == ""){
			SubmitLogin.disabled = false;
			SubmitLogin.style.backgroundColor = "blue";
		}
		else{
			SubmitLogin.disabled = true;
			SubmitLogin.style.backgroundColor = 'gray';
		}
		
		document.getElementById("err").innerHTML = err;
	}
}

function createRegister(){
	var root = document.getElementById("root");
	root.innerHTML = "";
	
	const div = document.createElement('div');
	div.id = 'RegisterPage';	
	
	const form = document.createElement('form');
	form.id = 'RegisterForm';
	form.onsubmit = collectRegister;

	var h1 = document.createElement('h1');
	h1.innerHTML = "Inregistrare in SmartPlanning";
	div.appendChild(h1);
	
	var input = document.createElement('input');
	input.type = 'text';
	input.id = 'FirstName';
	input.placeholder = 'First Name...';
	input.onkeyup = validateForm;
	form.appendChild(input);
	
	input = document.createElement('input');
	input.type = 'text';
	input.id = 'LastName';
	input.placeholder = 'Last Name...';
	input.onkeyup = validateForm;
	form.appendChild(input);
	
	input = document.createElement('input');
	input.type = 'email';
	input.id = 'email';
	input.placeholder = 'Email...';
	input.onkeyup = validateForm;
	form.appendChild(input);
	
	input = document.createElement('input');
	input.type = 'password';
	input.id = 'pass';
	input.placeholder = 'Password...';
	input.onkeyup = validateForm;
	form.appendChild(input);
	
	input = document.createElement('input');
	input.type = 'password';
	input.id = 'repass';
	input.placeholder = 'Retype Password...';
	input.onkeyup = validateForm;
	form.appendChild(input);
	
	var span = document.createElement('span');
	span.id = 'err';
	form.appendChild(span);
	
	input = document.createElement('button');
	input.type = 'submit';
	input.id = "SubmitRegister";
	input.innerHTML = "Register";
	form.appendChild(input);
	
	div.appendChild(form);
	
	root.appendChild(div);
	
	validateForm();
}

function collectRegister(event){
	event.preventDefault();
	
	const FirstName = document.getElementById("FirstName").value;
	const LastName = document.getElementById("LastName").value;
	const Email = document.getElementById("email").value;
	const Password = document.getElementById("pass").value;
	
	var data = {
		FirstName: FirstName,
		LastName: LastName,
		Email: Email,
		Password: Password
	};
	
	const apiUrl = 'https://185.27.135.185:3001/api/register';

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	  
	fetch(apiUrl, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error('Cerere eșuată'); 
			}
		return response.json();
		})
		.then(data => {
			console.log('Răspuns de la API:', data);
			createLogin();
		})
		.catch(error => {
			console.error('Eroare la cererea API:', error);
		});
}

function checkPassword(){
	var err = "<ul>";
	
	const password = document.getElementById("pass").value;
	
	const lowercaseRegex = /[a-z]/;
	const uppercaseRegex = /[A-Z]/;
	const digitRegex = /\d/;
	const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
	const minLength = 8;

	const isLowercase = lowercaseRegex.test(password);
	const isUppercase = uppercaseRegex.test(password);
	const isDigit = digitRegex.test(password);
	const isSpecialChar = specialCharRegex.test(password);
	const isMinLength = password.length >= minLength;
	
	if (!isLowercase) {
		err += "<li>Parola trebuie să conțină cel puțin o literă mică.</li>";
	}
	if (!isUppercase) {
		err += "<li>Parola trebuie să conțină cel puțin o literă mare.</li>";
	}
	if (!isDigit) {
		err += "<li>Parola trebuie să conțină cel puțin o cifră.</li>";
	}
	if (!isSpecialChar) {
		err += "<li>Parola trebuie să conțină cel puțin un caracter special.</li>";
	}
	if (!isMinLength) {
		err += `<li>Parola trebuie să aibă cel puțin ${minLength} caractere.</li>`;
	}
	
	if(err != '<ul>')
		err += '</li>';
	else
		err = "";

	return err;
}

function checkSimilar(){
	var pass = document.getElementById("pass").value;
	var repass = document.getElementById("repass").value;
	var err = ""
	if(pass != repass){
		err = "Parolele nu coincid";
	}
	else{
		err = "";
	}
	
	return err;
}

function validateForm(){
	var err = "";
	
	var SubmitRegister = document.getElementById("SubmitRegister");
	var FirstName = document.getElementById("FirstName").value;
	var LastName = document.getElementById("LastName").value;
	var email = document.getElementById("email").value;
	var pass = document.getElementById("pass").value;
	var repass = document.getElementById("repass").value;
	
	if(FirstName == "" || LastName == "" ||
		    email == "" || pass == "" || repass == ""){
		err = "Toate campurile trebuie completate";
	}
	
	if(pass != ""){
		err = checkPassword();
	}
	if(repass != ""){
		err = checkSimilar();
	}
	
	if(repass == "" && err == ""){
		err = "Toate campurile trebuie completate";
	}
	
	
	
	if(err == ""){
		SubmitRegister.disabled = false;
		SubmitRegister.style.backgroundColor = "blue";
	}
	else{
		SubmitRegister.disabled = true;
		SubmitRegister.style.backgroundColor = 'gray';
	}
	
	document.getElementById("err").innerHTML = err;
	
	if(email != ""){
		existEmail(email);
	}
}

function existEmail(email){
	const apiUrl = 'https://185.27.135.185:3001/api/existEmail';
		
		var data = {
			email: email,
		}

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		};
		  
		fetch(apiUrl, requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error('Cerere eșuată'); 
				}
			return response.json();
			})
			.then(data => {
				console.log('Răspuns de la API:', data);
				
				if(data.response == true){
					document.getElementById("err").innerHTML = "Emailul exista deja!";
					document.getElementById("SubmitRegister").disabled = true;
					document.getElementById("SubmitRegister").style.backgroundColor = 'gray';
				}
			})
			.catch(error => {
				console.error('Eroare la cererea API:', error);
			});
}




