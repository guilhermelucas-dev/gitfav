import { GithubUser } from "./GithubUser.js";

export class Favorites {

  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.users = JSON.parse(localStorage.getItem('@githup-favorites:')) || [];
  }

  save() {
    localStorage.setItem('@githup-favorites:', JSON.stringify(this.users));
  }

  async add(username) {
    try {

      const userExists = this.users.find(user => user.login === username);

      if (userExists) {
        throw new Error('Usuário já cadastrado');
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!');
      }

      this.users = [user, ...this.users];

      this.update();
      this.save();

    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.users.filter(entry => entry.login !== user.login);

    this.users = filteredEntries;
    this.update();
    this.save();
  }
}

// Classe que vai criar a visualização do enventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);


    this.tbody = this.root.querySelector('.table-users tbody');
    this.tbodyEmpty = this.root.querySelector('.table-users .tbody-empty');
   
    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector('.form-search button');

    addButton.addEventListener("click", (event) => {
      event.preventDefault();
      const { value } = this.root.querySelector('.form-search input');
      this.add(value);

    });
  }

  update() {

    if (this.users.length == 0) {
      console.log(this.tbody);
      this.tbody.classList.add('tbody-hiden');
      this.tbodyEmpty.classList.remove("tbody-hiden");
    } else {
      this.tbody.classList.remove('tbody-hiden');
      this.tbodyEmpty.classList.add("tbody-hiden");
    }

    this.removeAllTr();

    this.users.forEach(user => {
      const row = this.createRow();
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
      row.querySelector('.user img').alt = `Imagem de ${user.name}`;
      row.querySelector('.user a').href = `https://github.com/${user.login}`;
      row.querySelector('.user p').textContent = user.name;
      row.querySelector('.user span').textContent = `/${user.login}`;
      row.querySelector('.repositories').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;


      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?');

        if(isOk) {
          this.delete(user);
        }
      };
      this.tbody.append(row); 
   })
  }

  createRow() {

    const tr = document.createElement('tr');

    tr.innerHTML = `
    <td class="user">
      <div class="user-wrapper">
        <img class="user-image" src="https://github.com/maykbrito.png" alt="imagem de mykbrito">
        <a href="https://github.com/maykbrito" target="_blank">
        <p>Mayk Brito</p>
        <span>/maykbrito</span>
        </a>
      </div>
    </td>
    <td class="repositories">123</td>
    <td class="followers">1234</td>
    <td><button class="remove">remover</button></td>
    `;
    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove();
    })
    
  }
}