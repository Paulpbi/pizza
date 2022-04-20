/*
  !declaração de variaveis
*/
let cart = [];
let modalQt = 1;
let modalKey = 0;
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

/*
  arquivo de pizzas que simula uma API
*/

pizzaJson.map((item, index) => {
  let pizzaItem = c(".models .pizza-item").cloneNode(true);

  pizzaItem.setAttribute("data-key", index);
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `${item.price.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  })}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    let key = e.target.closest(".pizza-item").getAttribute("data-key");
    modalQt = 1;
    modalKey = key;

    /*
  Adiciona a imagem, o titulo, descrição, preço (fixado em 2 decimais após a virgula)
*/

    c(".pizzaBig img").src = pizzaJson[key].img;
    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    c(".pizzaInfo--actualPrice").innerHTML = pizzaJson[key].price.toFixed(2);
    c(".pizzaInfo--size.selected").classList.remove("selected");

    /*
  Adiciona a class 'Selected' aos tamanhos e preenche o span com os pesos das pizzas
*/

    cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }

      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    c(".pizzaInfo--qt").innerHTML = modalQt;

    /*
  Faz surgir o modal
*/

    c(".pizzaWindowArea").style.opacity = 0;
    c(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  c(".pizza-area").append(pizzaItem);
});

/*
  Efeitos fade e fechar modal
*/

function closeModal() {
  c(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    c(".pizzaWindowArea").style.display = "none";
  }, 500);
}

cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

/*
  Incremento e decremento dos botões de quantidade de pizza, funcionalidade de deixar ativo botões ativos na escolha de tamanhos
 */

c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    c(".pizzaInfo--qt").innerHTML = modalQt;
  }
});

c(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  c(".pizzaInfo--qt").innerHTML = modalQt;
});

cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", () => {
    c(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

/*
  adiciona a funcionalidade do botão "adicionar ao carrinho", verificação para adicionar uma nova quantidade de pizza ao carrinho
*/

c(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key"));

  let identifier = pizzaJson[modalKey].id + "@" + size;

  let key = cart.findIndex((item) => item.identifier == identifier);

  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});

/*
  Carrinho de compras, função de atualizar e abrir o carrinho caso tenha algum conteudo nele e remove quando não tem
*/

function updateCart() {
  if (cart.length > 0) {
    c("aside").classList.add("show");
    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      console.log(pizzaItem);
    }
  } else {
    c("aside").classList.remove("show");
  }
}
