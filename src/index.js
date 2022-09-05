//variable declarations
const mealsId = document.getElementById("meals");
const favContainer = document.getElementById("fav-meals");
const recipePopup = document.getElementById("meal-popup");
const mealInfo = document.getElementById("meal-info");
const popupCloseBtn = documen.getElementById("close-popup");
const searchName = document.getElementById("search-term");
const searchBtn = document.getElementById("search");

fetchRandomMeal();
fetchFavMeals();

//adding meals to the DOM

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

