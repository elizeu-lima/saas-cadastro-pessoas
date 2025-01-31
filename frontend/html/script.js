document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById("login-container");
    const registerContainer = document.getElementById("register-container");
    const peopleContainer = document.getElementById("people-container");
    const personModal = document.getElementById("person-modal");

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const personForm = document.getElementById("person-form");

    const toggleRegisterBtn = document.getElementById("toggle-register");
    const toggleBackBtn = document.getElementById("toggle-back");
    const logoutBtn = document.getElementById("logout-btn");
    const createPersonBtn = document.getElementById("create-person-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    let editPersonId = null; // Variável para armazenar ID ao editar

    toggleRegisterBtn.addEventListener("click", () => {
        loginContainer.style.display = "none";
        registerContainer.style.display = "block";
    });

    toggleBackBtn.addEventListener("click", () => {
        registerContainer.style.display = "none";
        loginContainer.style.display = "block";
    });

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        try {
            const response = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) throw new Error("Login falhou");
            
            const data = await response.json();
            localStorage.setItem("token", data.token);
            loginContainer.style.display = "none";
            peopleContainer.style.display = "block";
            fetchPeople();
        } catch (error) {
            alert("Erro ao logar: " + error.message);
        }
    });

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("register-name").value;
        const password = document.getElementById("register-password").value;
        
        try {
            const response = await fetch("http://localhost:3000/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) throw new Error("Cadastro falhou");
            
            alert("Usuário cadastrado com sucesso!");
            registerContainer.style.display = "none";
            loginContainer.style.display = "block";
        } catch (error) {
            alert("Erro ao cadastrar: " + error.message);
        }
    });

    createPersonBtn.addEventListener("click", () => {
        editPersonId = null;
        personForm.reset();
        document.getElementById("modal-title").textContent = "Cadastrar Pessoa";
        personModal.style.display = "block";
    });

    closeModalBtn.addEventListener("click", () => {
        personModal.style.display = "none";
    });

    personForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("person-name").value;
        const age = document.getElementById("person-age").value;
        const email = document.getElementById("person-email").value;
        const token = localStorage.getItem("token");
        
        try {
            const url = editPersonId 
                ? `http://localhost:3000/api/persons/${editPersonId}` 
                : "http://localhost:3000/api/persons";
            const method = editPersonId ? "PUT" : "POST";
            
            const response = await fetch(url, {
                method,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, age, email })
            });
            
            if (!response.ok) throw new Error("Erro ao salvar pessoa");
            
            alert(editPersonId ? "Pessoa atualizada com sucesso!" : "Pessoa cadastrada com sucesso!");
            personModal.style.display = "none";
            personForm.reset();
            fetchPeople();
        } catch (error) {
            alert("Erro ao salvar pessoa: " + error.message);
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        peopleContainer.style.display = "none";
        loginContainer.style.display = "block";
    });

    async function fetchPeople() {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/persons", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error("Erro ao buscar pessoas");
            
            const data = await response.json();
            const peopleList = document.getElementById("people-list");
            peopleList.innerHTML = "";
            data.forEach(person => {
                const div = document.createElement("div");
                div.innerHTML = `${person.name} - ${person.age} anos - ${person.email} 
                    <button onclick="editPerson('${person._id}', '${person.name}', '${person.age}', '${person.email}')">Editar</button>
                    <button onclick="deletePerson('${person._id}')">Excluir</button>`;
                peopleList.appendChild(div);
            });
        } catch (error) {
            console.error("Erro ao buscar pessoas:", error);
        }
    }

    window.editPerson = (id, name, age, email) => {
        editPersonId = id;
        document.getElementById("person-name").value = name;
        document.getElementById("person-age").value = age;
        document.getElementById("person-email").value = email;
        document.getElementById("modal-title").textContent = "Editar Pessoa";
        personModal.style.display = "block";
    };

    window.deletePerson = async (id) => {
        if (!confirm("Tem certeza que deseja excluir esta pessoa?")) return;
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/persons/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Erro ao excluir pessoa");
            fetchPeople();
        } catch (error) {
            alert("Erro ao excluir pessoa: " + error.message);
        }
    };

    fetchPeople();
});