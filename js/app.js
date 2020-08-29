const searchForm = document.getElementById('search-form');
const resultContainer = document.getElementById('results');
const appLoader = document.getElementById('loader-wrapper');
const resultsCount = document.getElementById('results-count');
const searchInput = document.querySelector('input[type=search]');
const recipeBtns = document.querySelectorAll('.btn-read-recipe');

// modal
const modal = document.querySelector('#recipe-details-modal');
const modalImageElement = document.querySelector('.recipe-img');
const modalTitleElement = document.querySelector('.modal-title');
const modalNutrientsTable = document.querySelector('.nutrients.table');
const modalIngredientsElement = document.querySelector('.ingredients');
const modalHealthLabelsElement = document.querySelector('.health-labels');

showLoader(false);
let responseHits;

/*================================================
=            Event handler assignment            =
================================================*/

recipeBtns.forEach(btn => {
	btn.addEventListener('click', showRecipeDetails);
});

searchForm.addEventListener('submit', handleRecipeSearch);

modal.addEventListener('click', evt => {
	evt.stopPropagation();
	closeModal();
}, {capture: false});

modal.querySelector('.btn-close')
	.addEventListener('click', closeModal);

/*=====  End of Event handler assignment  ======*/



/*=================================
=            functions            =
=================================*/
/**
* Handles recipe search
* 
*/
function handleRecipeSearch(evt){
	evt.preventDefault();
	let query = searchInput.value.trim();

	if(query.length < 1) return;

	getData(query)
		.then(res => res.hits)
		.then(hits => {
			responseHits = hits;
			resultsCount.textContent = hits.length;
			renderRecipeTemplate();

			document
				.querySelectorAll('button.btn-read-recipe')
				.forEach( btn => btn.addEventListener('click', showRecipeDetails));

			showLoader(false);
		})
		.catch(err => {
			if(err){
				results.innerHTML = "";
				console.error(err);
				showLoader(false);
			}
		})

	searchInput.value = "";
}

/**
* shows details of a recipe
*
* returns {undefined}
*/
function showRecipeDetails(evt){
	let recipe = responseHits[evt.target.dataset.index].recipe;
	modalTitleElement.textContent = recipe.label;
	modalImageElement.src = recipe.image;

	recipe.ingredients.forEach(ingredient => {
		modalIngredientsElement.innerHTML += `<li class="ingredient">${ ingredient.text }</li>`;
	});

	recipe.healthLabels.forEach(label => {
		modalHealthLabelsElement.innerHTML += `<li class="ingredient">${ label }</li>`;
	});

	for(let {label, quantity, unit} of Object.values(recipe.totalNutrients)){
		if(quantity > 0){
			modalNutrientsTable
				.querySelector('tbody')
				.innerHTML += `<tr><td>${label}</td><td>${quantity.toFixed(2) + unit}</td></tr>`;
		}
	}

	modal.classList.add('show');
}

/**
* Renders a list of recipes template
* 
* returns {String} recipe's template
*/
function renderRecipeTemplate(){

	function renderRecipeList(recipe){
		if(!recipe) return;

		let ingredientsList = '';
		const MAX_RECIPE_CHAR_COUNT = 50;

		for(let { text } of recipe.ingredients){
		 	ingredientsList += `${text}, `;
		}

		return ingredientsList.length > MAX_RECIPE_CHAR_COUNT 
			? `${ingredientsList.slice(0, MAX_RECIPE_CHAR_COUNT - 1)}...`
			: ingredientsList;
	}

	let template = '';
	responseHits
		.forEach( (item, index) => {
			let recipe = item.recipe;
			template += `<div class="col-md-4 col-lg-3">
			 				<div class="result-item p-3">
			 					<img src="${ recipe.image }" class="recipe-img w-100" alt="">
			 					<h4 class="pt-2 text-danger">${ recipe.label }</h4>
			 					<p>${renderRecipeList(recipe)}</p>
			 					<button class="btn btn-danger w-100 btn-read-recipe" data-index="${index}">view</button>
			 				</div>
			 			</div>
			 			`;
		});

	results.innerHTML = template;
}

/**
*
* Attempts make a request to get some data
* if a false argument is passed, it shows loader
*
*/
async function getData(query = 'meal'){
	const BASE_URL = 'https://api.edamam.com/search';
	const APP_ID = '27405351';
	const APP_KEY = '8a9c5a0b765495ba5ccf340cb3d98624';

	showLoader();
	const response = await axios({
		url: `${BASE_URL}?q=${ query }&app_id=${APP_ID}&app_key=${APP_KEY}`,
		method: 'get',
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	});

	return Promise.resolve(response.data);
}

/**
*
* Attempts to show app loader
*
*/
function showLoader(show = true){
	if(show){
		appLoader.classList.remove('hide');
	} else {
		appLoader.classList.add('hide');
	}
}

function closeModal(){
	modal.classList.remove('show');
}
/*=====  End of functions  ======*/