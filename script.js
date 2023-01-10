const container = document.querySelector(".container");
const closeIcon = document.querySelector(".zubreitung i");
const zubereitung = document.querySelector(".zubreitung");
const input = document.querySelector(".input");
const main = document.querySelector(".main");
const serchbtn = document.querySelector(".btn");
let recete;
let url;
function addActive() {
  zubereitung.classList.remove("active");
  input.setAttribute("readonly", "readonly");
  serchbtn.hidden = true;
}
function viewZubereitung() {
  zubereitung.classList.add("active");
  input.removeAttribute("readonly");
  serchbtn.hidden = false;
}

serchbtn.addEventListener("click", () => {
  recete = input.value;
  url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${recete}`;
  zubereitung.innerHTML = "";
  main.innerHTML = "";
  if (recete != "") {
    getRecet()
      .then(() => {
        zubereitungRecete();
      })
      .catch((erro) => {
        console.log("hallo");
        console.log(erro);
      });
    input.value = "";
  }
});
function getRecet() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((respons) => {
        if (respons.ok) {
          return respons.json();
        } else {
          reject("erreur de reposse");
        }
      })
      .then((data) => {
        let imgEl = document.createElement("img");
        imgEl.src = `${data.meals[0].strMealThumb}`;
        let divEl = document.createElement("div");
        divEl.setAttribute("class", "foodDetails");
        let h2EL = document.createElement("h2");
        h2EL.innerHTML = `${data.meals[0].strMeal}`;
        divEl.appendChild(h2EL);
        let spanEl = document.createElement("span");
        spanEl.innerHTML = `${data.meals[0].strCategory}`;
        divEl.appendChild(spanEl);
        let ulEl = document.createElement("ul");
        ulEl.classList.add("zutaten");

        let arrOfAllIngredient = [];
        for (let i = 1; i <= 20; i++) {
          let zutate =
            data.meals[0][`strMeasure${i}`] +
            " " +
            data.meals[0][`strIngredient${i}`];
          arrOfAllIngredient.push(zutate);
        }

        let arrOfAllIngredientSansVide = [];
        arrOfAllIngredient.forEach((element) => {
          if (element.length > 2 && element != "null null") {
            arrOfAllIngredientSansVide.push(element);
          }
        });
        arrOfAllIngredientSansVide.forEach((el) => {
          let liEl = document.createElement("li");
          liEl.innerText = `${el}`;
          ulEl.appendChild(liEl);
        });

        let btnView = document.createElement("button");
        btnView.classList.add("btn");
        btnView.classList.add("details");
        btnView.setAttribute("onclick", "addActive()");
        btnView.innerText = "viwe";
        main.appendChild(imgEl);
        main.appendChild(divEl);
        main.appendChild(ulEl);
        main.appendChild(btnView);
        console.log(data.meals[0]);
        resolve();
      });
  });
}
function zubereitungRecete() {
  fetch(url)
    .then((respons) => respons.json())
    .then((data) => {
      let IconEl = document.createElement("i");
      IconEl.classList.add("fa");
      IconEl.classList.add("fa-times");
      IconEl.setAttribute("aria-hidden", "true");
      IconEl.setAttribute("onclick", "viewZubereitung()");
      let pEl = document.createElement("p");
      pEl.classList.add("preparation");
      pEl.innerHTML = `${data.meals[0].strInstructions}`;
      zubereitung.appendChild(IconEl);
      zubereitung.appendChild(pEl);
      container.appendChild(zubereitung);
    });
}
