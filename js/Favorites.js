import { githubUser } from "./githubUser.js";
//Classe que vai conter a lógica dos dados
// Como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root); //Div APP -> Passada na main.js
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExist = this.entries.find(entry => entry.login === username)

      if (userExist) {
        throw new Error ('Usuário já cadastrado!');
      }

      const user = await githubUser.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save()

    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save()
  }
}

//Classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  update() {
    this.removeAlltr();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha?");
        if (isOk) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td class="user">
          <img src="https://github.com/nicollysantanna.png" alt="Imagem de Nicolly" />
          <a href="https://github.com/nicollysantanna">
          <p>Nicolly Sant'Anna</p>
          <span>NicollySantanna</span>
          </a>
        </td>
        <td class="repositories">15</td>
        <td class="followers">20</td>
        <td>
           <button class="remove">&times;</button> 
        </td>
     
        
        `;

    return tr;
  }

  removeAlltr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
