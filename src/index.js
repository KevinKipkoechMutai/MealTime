//declaring variables and getting elements from the DOM
const search = document.getElementById("search");
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMealEl = document.getElementById("single-meal");


//fetching meals from the API
function searchMeal(e) {
    //eliminate default behavior of the DOM
    e.preventDefault();

    //clear the single meal section in the DOM
    singleMealEl.innerHTML = "";

    //declaring the search variable
    const term = search.value;

    //check if the input is empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then((res) => res.json())
            .then((data) => {
                resultHeading.innerHTML = `<h4>Search results for '${term}'</h4>`;
                if (data.meals === null) {
                    resultHeading.innerHTML = `<p>There are no search results for (${term}), please try another search term.</p>`;
                    mealsEl.innerHTML = "";
                } else {
                    mealsEl.innerHTML = data.meals.map((meal) => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `).join("");
                }
            });
            //clear the search term
            search.value = "";
    } else {
        alert("Enter a valid search term")
    }
}

//enter the filtered meal list
function loadInitialMeals() {
    //clear the single meal from the DOM
    singleMealEl.innerHTML = "";

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=American`)
        .then((res) => res.json())
        .then((data) => {
            resultHeading.innerHTML = ``;

            if (data.meals === null) {
                resultHeading.innerHTML = `Error, kindly refresh the page`;
                mealsEl.innerHTML = '';
            } else {
                mealsEl.innerHTML = data.meals.map((meal) => `
                <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
                `).join('');
            }
        });
        //clear the search term
        search.value = "";
}

loadInitialMeals();

//fetching meals from the API by ID
function getMealByID(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
}

//fetching random meals from API
function getRandomMeal() {
    //clear heading and meal info
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];
            addRandomMealToDOM(meal);
        });
}

//adding meals to the DOM
function addMealToDOM(meal) {
    const ingredients = [];

    for (let i=1; i<=20; ++i) {
        if (meal[`strIngredients${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    singleMealEl.innerHTML = `
    <hr/>
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="single-meal-info">
            ${meal.strCategory ? `<p><span class="categoryAndOrigin">Category:</span>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p><span class=categoryAndOrigin>Origin:</span></p>` : ''}
        </div>
        <div class="main">
            <p id="meal-making-instructions">${meal.strInstructions}</p>
            <hr/>
            <h2>Ingredients</h2>
            <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join('')}</ul>
        </div>
    </div>
    `;
}

//adding ramdom meals to the DOM
function addRandomMealToDOM(meal) {
    const ingredients = [];

    for (let i=1; i<=20; ++i) {
        if (meal[`strIngredients${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    singleMealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="single-meal-info">
            ${meal.strCategory ? `<p><span class="categoryAndOrigin">Category:</span>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p><span class=categoryAndOrigin>Origin:</span></p>` : ''}
        </div>
        <div class="main">
            <p id="meal-making-instructions">${meal.strInstructions}</p>
            <hr/>
            <h2>Ingredients</h2>
            <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join('')}</ul>
        </div>
    </div>
    `;
}

//scroll to a single meal by clicking
function scrollTo() {
    window.location = '#single-meal';
}


//adding event listeners to the buttons and elements
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', (e) => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealByID(mealID);
    }
    scrollTo("single-meal");
});


