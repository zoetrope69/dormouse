function getUrlPath(){
	return document.location.pathname.substring(1).split('/');
}

function routeUrl(){

	var path = getUrlPath();

	// if this a route we can use
	if(path.length > 1 && path[1]){

		var resourceType = path[0];
		var resourceValue = path[1];

		if(resourceType === 'category'){
			dormouse.category = resourceValue;
			getItems();

			var categoryEls = document.querySelectorAll('.categories li a');
			var clickedCategoryEl = document.querySelector('.categories #cat-'+resourceValue);
			
			if(categoryEls){
				for(var i = 0; i < categoryEls.length; i++){
					categoryEls[i].classList.remove('category--active');
				}
			}

			if(clickedCategoryEl){
				clickedCategoryEl.classList.add('category--active');
			}

		}
		else if(resourceType === 'item'){
    		getPopUpData(resourceValue);
		}
		else{
			history.pushState(null, "", "/");
		}

	}else{
		history.pushState(null, "", "/");
	}

}
