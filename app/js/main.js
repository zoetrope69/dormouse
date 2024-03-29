// main


// on load
(function(){

	if(!dormouse.install){
		closePopUp();

		initAll();
		updateAll();

		routeUrl();
	}else{
		installDb();
		initSubmitButtonListener();
	}

	// removes the no script from the DOM
	removeNoScript();

})();

function removeNoScript(){
	var noscript = document.querySelector('noscript')
	noscript.parentNode.removeChild(noscript);
}

function initSearchIconListener(){
	var searchLabel = document.querySelector('.search-submit');
	var searchBox = document.querySelector('.search');

	// add hidden class to search
	searchBox.classList.add('search--hidden');

	searchLabel.addEventListener('click', searchToggle);
}

function searchToggle(){
	var searchBox = document.querySelector('.search');
	var searchQuery = document.querySelector('.search-query');
	var searchSubmit = document.querySelector('.search-submit');

	searchBox.classList.toggle('search--hidden');

	if(searchBox.classList.contains('search--hidden')){
		searchQuery.blur();
		searchSubmit.innerHTML =  "<i class='fa fa-search'></i> Search";
	}else{
		searchQuery.focus();
		searchSubmit.innerHTML =  "<i class='fa fa-times'></i>  Close";
	}

}

function headerHeightFix(){
	var header = document.querySelector('header');
	var headerSize = header.offsetHeight-1+'px';
	document.body.style.marginTop = headerSize;
}

function initHeaderHeightFix(){
	headerHeightFix();
	window.addEventListener('resize', headerHeightFix);
}

function updateAll(){
	getCategories();
	getItems();
	updateBasket();
}

function initAll(){
	initDisplayOption();
	initBasket();
	initIconSwap();
	initGetItemsListeners();
	initSearchIconListener();
	initHeaderHeightFix();
	initAdminButtons();
}

// to swap any text with dirty icons
function initIconSwap(){

	// get list of icons
	var icons = document.querySelectorAll('.icon-swap');
	// list of icons to swap out the text with
	var iconSwapLookup = {
		'Search': 'search',
		'Grid': 'th-large',
		'List': 'th-list',
		'Basket': 'shopping-cart'
	};

	for(var i in icons){		
		var icon = icons[i];

		// if the object has innerHTML
		if(icon.hasOwnProperty('innerHTML')){

			// swap the text with the icon name
			var className = iconSwapLookup[icon.innerHTML];
			icon.innerHTML = '<i class="fa fa-'+className+'"></i> '+icon.innerHTML;

			// remove the class showing it was for swapping
			icon.classList.remove('icon-swap');

		}

	}

}

// for setting up the buttons for switching the display of the items
function initDisplayOption(){
	var displayOptions = document.querySelectorAll('.display-option');

	if(!localStorage.getItem('displayOption')){
		localStorage.setItem('displayOption', dormouse.defaultDisplayOption);
	}

	var displayOption = localStorage.getItem('displayOption');

	// hide the first display option
	document.getElementById(displayOption+'-display-option-label').style.display = 'none';
	document.getElementById(displayOption+'-display-option').checked = true;

	for(var j in displayOptions){
		var displayOption = displayOptions[j];

		if(displayOption.hasOwnProperty('innerHTML')){
			displayOption.addEventListener('click', displayOptionToggle);
		}
	}

}

// toggle the display options buttons
function displayOptionToggle(){
	var displayOptions = document.querySelectorAll('.display-option');
	var items = document.querySelectorAll('.items li');
	var displayOptionType = 'list';

	for(var k in displayOptions){
		var displayOption = displayOptions[k];

		if(displayOption.hasOwnProperty('innerHTML')){
			if(displayOption.style.display === ''){
				displayOption.style.display = 'none';
				displayOptionType = 'grid';
			}else{
				displayOptionType = 'list';
				displayOption.style.display = '';
			}
			localStorage.setItem('displayOption', displayOptionType);
		}
	}

	getItems();

}
	