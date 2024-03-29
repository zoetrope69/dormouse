// popup

function getPopUpData(itemId, type){
	
	ajax({ "url": dormouse.url+'/data/item/'+itemId }, function(data){
		populatePopUp(data, type);
	});	

	displayPopUp();
}

function populatePopUp(json, type){
	var data = json.output;
	var item = data.items[0];

	var popup =  document.querySelector('.popup');
	var popupTools =  document.querySelector('.popup_tools');
	var imgContainer = document.querySelector('.popup__img');
	var details = document.querySelector('.popup .details');
	var add = popupTools.querySelector('.add');
	var adminSection = popupTools.querySelector('.popup_tools--admin');

	/* reset */

	imgContainer.innerHTML = "";
	details.innerHTML = "";
	add.innerHTML = "";
	adminSection.innerHTML = "";

	var addOutput = "";
	var detailsOutput = "";
	var adminSectionOutput = "";

	if(type == "default" || type == "edit"){

		if(item){

			popup.id = item.id;

			var price = +item.price.value;
			price = price.formatMoney(2);
		
		}

	}

	if(type == "default"){

		detailsOutput =
				"<h1 class='details-title'>"+item.name+"</h1>
				<p class='details-cat'>Found in "+item.cat.name+"</p>
				<p class='details-desc'>"+item.desc+"</p>
				<p class='details-price'><span class='details-price-currency'>"+item.price.currency+"</span>"+price+"</p>
				<p class='details-stock'>"+item.stock+" left</p>";

		if(item.img != 0){
			var img = document.createElement('img');
			imgContainer.appendChild(img);

			img.setAttribute('src', dormouse.url+"/images/"+item.id);
			img.setAttribute('alt', "Image of '"+item.name+"'");
		}else{	
			imgContainer.innerHTML = "<div class='placeholder-img' title='Placeholder image of '"+item.name+"'></div>";
		}

		addOutput =
			'<h2 class="add-title">Add to basket</h2>
			<select name="amount" class="amount">';

		var addAmount = 30;

		for(var i = 1; i <= addAmount; i++){

			addOutput += '<option value="'+i+'">';

			if(i < 10){
				addOutput += '0'+i;
			}else{
				addOutput += i;
			}

			addOutput += '</option>';

		}
				
		addOutput += '</select>
					  <button class="add-button">Add</button>';


		adminSectionOutput = '<button class="admin-button admin-button--edit">Edit</button>';

	}
	else if(type == "edit"){

		detailsOutput =
			"<label>Name: </label><textarea required class='details-title' placeholder='Enter your item name'>"+item.name+"</textarea>
			<label>Category: </label><select required class='details-cat'><option>Select your category</option></select>
			<label>Description: </label><textarea required class='details-desc' placeholder='Description for your item goes here'>"+item.desc+"</textarea>
			<label>Price: <span class='details-price-currency'>("+item.price.currency+")</span></label><input required class='details-price' inputmode='numeric' placeholder='0.00' value="+price+">";
		
		if(item.img != 0){
			imgContainer.innerHTML = "<img src='"+dormouse.url+"/images/"+item.id+"' alt='Placeholder image of '"+item.name+"'>";
		}else{	
			imgContainer.innerHTML = "<div class='placeholder-img alter-img' title='Placeholder image of '"+item.name+"'><p>Update image</p></div>";
		}

		addOutput = "<h2 class='add-title'>Stock to update</h2>";
		addOutput += "<input class='amount amount--edit' type='number' inputmode='numeric' min='1' value='"+item.stock+"'>";

		adminSectionOutput = '<button class="admin-button admin-button--save">Save</button>';
		adminSectionOutput += '<button class="admin-button admin-button--delete">Delete</button>';

	}
	else if(type == "add"){

		imgContainer.innerHTML = '<input class="hidden-file-input" type="file" id="fileElem" accept="image/*">';
		imgContainer.innerHTML += "<div class='alter-img' title='Placeholder image'><p>Add image</p></div>";

		detailsOutput +=
			"<label>Name: </label><textarea autofocus required class='details-title' placeholder='Enter your item name'></textarea>
			<label>Category: </label><select required class='details-cat'><option>Select your category</option></select>
			<label>Description: </label><textarea required class='details-desc' placeholder='Description for your item goes here'></textarea>
			<label>Price: </label><input required class='details-price' inputmode='numeric' placeholder='0.00'>";

		addOutput = "<h2 class='add-title'>Stock to add</h2>";
		addOutput += "<input class='amount amount--edit' type='number' inputmode='numeric' min='1' value='1'>";
		
		adminSectionOutput = '<button class="admin-button admin-button--add">Add</button>';

	}

	if(type == "add" || type == "edit"){

		ajax({ url: dormouse.url+'/data/category' }, function(json){
			var categories = json.output.categories;

			var output = "<option value='#'>Select your category</option>"; 

			if(!categories.length){
				var output = "<option value='#'>You need to add categories</option>"; 
			}

			categories.forEach(function(category){
				var catName = ""+category.name;
				var catId = category.id;

				if(item && catId == item.cat.id && type == "edit"){
					output += "<option selected value='"+catId+"'>"+catName+"</option>";
				}else{
					output += "<option value='"+catId+"'>"+catName+"</option>";
				}
			});

			var detailsCats = document.querySelector('.popup .details-cat');

			detailsCats.innerHTML = output;

		});

	}
	
	add.innerHTML = addOutput;
	details.innerHTML = detailsOutput;
	adminSection.innerHTML = adminSectionOutput;

	initAddToBasketButtonListener();
	initEditItemButtonListener();
	initSaveItemButtonListener();
	initDeleteItemButtonListener();
	initAddItemButtonListener();
	initFileUploadListeners();

}

function displayPopUp(){
	var content = document.querySelector('.content-container');
	content.classList.add('content-container--blurred');

	var popup = document.querySelector('.popup');
	popup.classList.remove('popup--hidden');
	
	closeBasket();
}

function closePopUp(){
	var popup = document.querySelector('.popup');

	popup.addEventListener('click', function(e){
		if(e.target == e.currentTarget || e.target.className == 'popup_close' || e.target.parentNode.className == 'popup_close'){
			hidePopUp();
		}
	});
}

function hidePopUp(){
	var popup = document.querySelector('.popup');

	popup.classList.add('popup--hidden');

	popup.querySelector('.popup_tools .amount').selectedIndex = 0;

	var content = document.querySelector('.content-container');
	content.classList.remove('content-container--blurred');

	if(dormouse.category){
		history.pushState(null, "", dormouse.url+"/category/"+dormouse.category);
	}else{
		history.pushState(null, "", dormouse.url);
	}
}

function initFileUploadListeners(){
	var hiddenFileInput = document.querySelector('.hidden-file-input');
	var alterImgButton = document.querySelector('.alter-img');

	if(hiddenFileInput){

		hiddenFileInput.addEventListener('change', function(e){
			handleFiles(e.target.files);
		}, false);

	}

	if(alterImgButton){

		alterImgButton.addEventListener('click', function(e){

			if(hiddenFileInput){
				hiddenFileInput.click();
			}

			e.preventDefault();
		}, false);

	}

	var dropbox = alterImgButton;
	
	if(dropbox){
		dropbox.addEventListener("dragenter", dragenter, false);
		dropbox.addEventListener("dragover", dragover, false);
		dropbox.addEventListener("dragleave", dragleave, false);
		dropbox.addEventListener("drop", drop, false);
	}

	function dragleave(e){
		alterImgButton.classList.remove("alter-img--dragging");

		e.stopPropagation();
		e.preventDefault();
	}

	function dragenter(e){
		e.stopPropagation();
		e.preventDefault();
	}

	function dragover(e){
		alterImgButton.classList.add("alter-img--dragging");

		e.stopPropagation();
		e.preventDefault();
	}

	function drop(e){
		alterImgButton.classList.remove("alter-img--dragging");

		e.stopPropagation();
		e.preventDefault();

		var dt = e.dataTransfer;
		var files = dt.files;

		handleFiles(files);
	}

}

function initAddToBasketButtonListener(){
	var popup = document.querySelector('.popup');
	var addButton = popup.querySelector('.popup_tools .add .add-button');
	var addAmount = popup.querySelector('.popup_tools .add .amount');

	if(addButton){

		addButton.addEventListener('click', function(){
			var amountToAdd = +addAmount.value;
			var basketAmount = getBasketItemAmount(popup.id);

			var amount = amountToAdd + basketAmount;
			alterBasketItem(popup.id, amount);

			alertMessage('Added '+amountToAdd+'! ('+amount+' in the basket)', 'success');

		});

	}

}

function initEditItemButtonListener(){

	var popup = document.querySelector('.popup');
	var editButton = popup.querySelector('.popup_tools .admin-button--edit');

	if(editButton){

		editButton.addEventListener('click', function(){
			hidePopUp();
				
			alertMessage('Time to edit!', 'info');

			setTimeout(function(){
				getPopUpData(popup.id, "edit");
	
			}, 550);

		});

	}
}

function initSaveItemButtonListener(){

	var popup = document.querySelector('.popup');
	var saveButton = popup.querySelector('.popup_tools .admin-button--save');
	var addAmount = popup.querySelector('.popup_tools .add .amount');

	if(saveButton){

		saveButton.addEventListener('click', function(){

			var itemId = popup.id;
			var item = {};

			if(item = dataValidation(popup, addAmount)){
				hidePopUp();
				alertMessage('Updated "'+item.name+'"!', 'success');
				
				updateItems(itemId, [item]);

				setTimeout(function(){
					getPopUpData(popup.id, "default");
				}, 550);
			}

		});

	}
}

function initDeleteItemButtonListener(){

	var popup = document.querySelector('.popup');
	var deleteButton = popup.querySelector('.popup_tools .admin-button--delete');

	if(deleteButton){

		deleteButton.addEventListener('click', function(){

			var itemId = popup.id;
			
			hidePopUp();
			
			deleteItems(itemId);
			
			alertMessage('Item deleted', 'success');
			
		});

	}
}

function initAddItemButtonListener(){

	var popup = document.querySelector('.popup');
	var addButton = popup.querySelector('.popup_tools .admin-button--add');
	var addAmount = popup.querySelector('.popup_tools .add .amount');

	if(addButton){

		addButton.addEventListener('click', function(){

			var item = {};
			if(item = dataValidation(popup, addAmount)){

				addItems([item]);

				if(item.img){
					sendFiles();
				}

				hidePopUp();
				alertMessage('Added "'+item.name+'"" to system', 'success');

			}

		});

	}

}

function dataValidation(popup, addAmount){
	var name = ""+popup.querySelector('textarea.details-title').value.trim();
	var catId = +popup.querySelector('select.details-cat').value;
	var desc = ""+popup.querySelector('textarea.details-desc').value.trim();
	var price = +replaceAll(",", "", popup.querySelector('input.details-price').value.trim());
	var stock = +addAmount.value;
	var img = document.querySelector(".popup__img img");

	sendFiles();

	var item = {
		"name": name,
		"desc": desc,
		"price": price,
		"stock": stock,
		"img": !!img,
		"cat": catId
	};

	if(!name || name == ''){
		alertMessage('Oops - Enter a name', 'warning');
	}
	else if(!desc || desc == ''){
		alertMessage('Oops - Enter a description', 'warning');
	}
	else if(!price || price == '' || isNaN(price)){
		alertMessage('Price must be a number', 'error');
	}
	else if(isNaN(catId)){
		alertMessage('Oops - Pick a category', 'warning');
	}
	else if(catId <= 0){
		alertMessage('Oops - Pick a valid category', 'warning');
	}
	else if(isNaN(stock)){
		alertMessage('Stock must be a number', 'error');
	}
	else if(stock < 0){
		alertMessage('Stock can\'t be negative', 'error');
	}
	else{
		return item;
	}

	return false;
}