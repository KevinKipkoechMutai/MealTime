//variable declarations
const mealsId = document.getElementById("meals");
const favContainer = document.getElementById("fav-meals");
const recipePopup = document.getElementById("meal-popup");
const mealInfoElement = document.getElementById("meal-info");
const popupCloseBtn = documen.getElementById("close-popup");
const searchName = document.getElementById("search-term");
const searchBtn = document.getElementById("search");

fetchRandomMeal();
fetchFavMeals();


//fetching a random meal from theMealDB API

async function fetchRandomMeal() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const responseData = await response.json();
    const randomMeal = responseData.meals[0];

    addMeal(randomMeal, true);
    
}

//fetching meals from the database using meal ID
async function fetchMealById(id) {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
    const responseData = await response.json();
    const mealDesc = responseData.meal[0];
    return mealDesc;
}

//fetching meals using search
async function fetchMealBySearch(name) {
    const response = fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + name);
    const responseData = await (await response).json();
    const meals = responseData.meals;
    return meals;
}


//adding meals to the DOM
function addMeal(mealInfo, random=false) {
    console.log(mealInfo);

    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
    <div class="meal-header">
        ${random? `<span class="random">Random Recipe</span>`: ""} 
        <img src="${mealInfo.strMealThumb}" alt="${mealInfo.strMeal}"/>
    </div>
    <div class="meal-body">
        <h4>${mealInfo.strMeal}</h4>
        <button class="fav-btn"><i clas="fas fa-heart"></i></button>
    </div>
    `;
    const btn = meal.querySelector(".meal-body .fav-btn");

    btn.addEventListener('click', () => {
        if (btn.classList.contains("active")) {
            removeMealLS(mealInfo.idMeal);
            btn.classList.remove("active");
        } else {
            addMealLS(mealInfo.idMeal);
            btn.classList.add("active");
        }
        fetchFavMeals();
    });
    meal.addEventListener('click', () => {
        displayMealInfo(mealInfo);
    });
    mealsId.appendChild(meal);
}

//Adding meals to list
function addMealLS(mealName) {
    const mealNames = getMealsLS();
    localStorage.setItem('mealNames', JSON.stringify([...mealNames, mealName]));
}

//Removing mealsfrom the DOM
function removeMealLS(mealName) {
    const mealNames = getMealsLS();
    localStorage.setItem("mealNames", JSON.stringify(mealNames.filter((id) => id !== mealName)));
}

//fetching meals from list
function getMealsLS() {
    const mealNames = JSON.parse(localStorage.getItem('mealNames'));
    return mealNames === null ? []  : mealNames;
}

//fetching favorite meals
function fetchFavMeals() {
    favContainer.innerHTML = "";
    const mealNames = getMealsLS();

    for (let i=0; i<mealNames.length; i++) {
        const mealName = mealNames[i];
        meal = await fetchMealById(mealName);
        addMealFav(meal);
    }
}

//adding meals to favorites
function addMealFav(mealInfo) {
    const favMeal = document.createElement("li");
    favMeal.innerHTML = `
    <img src="${mealInfo.strMealThumb}" alt="${mealInfo.strMeal}"/>
    <span>${mealInfo.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i></button>
    `
    const btn = favMeal.querySelector('.clear');
    btn.addEventListener('click', ()=> {
        removeMealLS(mealInfo.idMeal);
        fetchFavMeals();
    });

    favMeal.addEventListener('click', () => {
        displayMealInfo(mealInfo);
    });

    favContainer.appendChild(favMeal);
}

//displaying meal information
function displayMealInfo(mealInfo) {
    mealInfoElement.innerHTML ="";
    const mealElement = document.createElement("div");
    const ingredients = [];
    for (let i=1; i<=20; i++) {
        if (mealInfo['strIngredient' + i]) {
            ingredients.push(`${mealInfo["strIngredient" + i]} - ${mealInfo["strMeasure" + i]}`);
        } else {
            break;
        }
    }
    mealElement.innerHTML = `
    <h1>${mealInfo.strMeal}</h1>
    <img src="${mealInfo.strMealThumb}" alt="${mealInfo.strMeal}"/>
    <p>${mealInfo.strInstructions}</p>
    <h3>Ingredients:</h3>
    <ul>${ingredients.map((ing)=> `<li>${ing}</li>`).join("")}</ul>
    `;
    mealInfoElement.appendChild(mealElement);
    recipePopup.classList.remove('hidden');
}

searchBtn.addEventListener('click', async () => {
    mealsId.innerHTML = "";

    const search = searchName.value;
    const meals = await fetchMealBySearch(search);

    if (meals) {
        meals.forEach((meal) => {addMeal(meal)});
    }
});

