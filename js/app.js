const searchForm = document.getElementById('search-form');
const resultContainer = document.getElementById('results');
const appLoader = document.getElementById('loader-wrapper');
const resultsCount = document.getElementById('results-count');
const searchInput = document.querySelector('input[type=search]');

hideLoader();

searchForm.addEventListener('submit', evt => {
	evt.preventDefault();
	let query = searchInput.value;
	
	getData(query)
		.then(res => res.hits)
		.then(hits => {
			
			let template = '';
			hits.forEach( item => {
				let recipe = item.recipe;
				template += `<div class="col-md-4 col-lg-3">
				 				<div class="result-item p-3">
				 				<img src="${ recipe.image }" class="recipe-img w-100" alt="">
				 				<h4 class="pt-2 text-danger">${ recipe.label }</h4>
				 				<p>
				 			`;

				let recipeList = '';

				for(let { text } of recipe.ingredients){
				 	recipeList += `${text}, `;
				}
				if(recipeList.length > 200){
					template += recipeList.slice(0, 199) +  `... </p> </div></div>`;
				} else {
					template += recipeList +`</p> </div></div>`;
				}

			});

			results.innerHTML = template;
			resultsCount.textContent = hits.length;

			hideLoader();
		})
		.catch(err => {
			if(err){
				results.innerHTML = "";
				console.log(err);
				hideLoader();
			}
		})

	searchInput.value = "";
});


/**
*
* Attempts make a request to get some data
* if a false argument is passed, it shows loader
*
*/
async function getData(query){
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
* Attempts to hide app loader
*
*/
function hideLoader(hide = true){
	appLoader.classList.add('hide');
}

/**
*
* Attempts to show app loader
*
*/
function showLoader(){
	appLoader.classList.remove('hide');
}