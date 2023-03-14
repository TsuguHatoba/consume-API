const searchInput = document.getElementById("search-input");

searchInput.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13 || event.which === 13) {
    console.log("Enter key is pressed");
    getMealList();
  }
});

const searchBtn = document.getElementById("search-btn");
const category = document.getElementById("category")
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");

//event listeners
searchBtn.addEventListener("click", getMealList);
searchBtn.addEventListener("keypress", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});

//get meal list that matches with the ingredients
function getMealList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
                <div class="meal-item" data-id="${meal.idMeal}">
                <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="food">
                </div>
                <div class="meal-name">
                    <h3>${meal.strMeal}</h3>
                    <a href="#" class="recipe-btn"> Get Recipe</a>
                </div>
            </div>
                `;
        });
        mealList.classList.remove("notFound");
      } else {
        html = "Maaf, menu yang dicari tidak tersedia";
        mealList.classList.add("notFound");
      }
      mealList.innerHTML = html;
    });
}

//category
// function getCategory() {
//   fetch('www.themealdb.com/api/json/v1/1/list.php?c=list')
//   .then(response => response.json())
//   .then(data => {
//     data.meals.forEach(meal => {
//       let html = '';
//       html =+ `
//       <li class="navbar-item">
//                 <a onclick="fetchCategoryMeal('${meal.strCategory}')"
//                     class="navbar-link-category" tabindex="0" href="#mealCardsSection">${meal.strCategory}</a>
//                 </li>`;
//                 NavBarCategory.innerHTML += html;
//     })
//   })
// }

// $(document).ready(function(){
//   // Uses the fetch() API to request category recipes from TheMealsDB.com API
//   fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
//   .then(res => res.json())
//   .then(res => {
//       res.meals.forEach(meal => {
//           let listCategory = ''
//           listCategory += `
//               <li class="navbar-item">
//               <a onclick="fetchCategoryMeal('${meal.strCategory}')"
//                   class="navbar-link-category" tabindex="0" href="#mealCardsSection">${meal.strCategory}</a>
//               </li>`;
//           NavBarCategory.innerHTML += listCategory;
//       });
//   })
// });

//get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          if (data.meals[0][`strIngredient${i}`]) {
            ingredients.push(data.meals[0][`strIngredient${i}`]);
          }
        }
        mealRecipeModal(data.meals, ingredients);
      });
  }
}

//create a modal
function mealRecipeModal(meal, ingredients) {
  console.log(meal);
  meal = meal[0];

  //slice array
  const halfIndex = Math.ceil(ingredients.length / 2);
  const leftIngredients = ingredients.slice(0, halfIndex);
  const rightIngredients = ingredients.slice(halfIndex);

  let html = `
      <h2 class="recipe-title">${meal.strMeal}</h2>
      <div class="recipe-meal-img">
          <img src="${meal.strMealThumb}" alt="" />
      </div>
      <br>
      <p class="recipe-category">${meal.strCategory}</p>
      <br><br>
      <h3 style="text-align: center;">Ingredients:</h3>
      <br>
      <div class="recipe-ingredients">
          <div class="ingredients-left">
              <ul>
                  ${leftIngredients
                    .map((ingredient) => `<li>${ingredient}</li>`)
                    .join("")}
              </ul>
          </div>
          <div class="ingredients-right">
              <ul>
                  ${rightIngredients
                    .map((ingredient) => `<li>${ingredient}</li>`)
                    .join("")}
              </ul>
          </div>
      </div>
      <div class="recipe-instruct">
          <h3>Instructions:</h3>
          <p>${meal.strInstructions}</p>
      </div>
      <div class="recipe-link">
          <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
      </div>
    `;

  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}
