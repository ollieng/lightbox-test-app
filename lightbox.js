let imageList;
let currentIndex;

/**
 * Populate the album page, using the collection from the api call
 */
function buildGrid() {
	const listContainer = document.getElementById('imageGrid');
	const subContainer = document.createElement('div');

	imageList.forEach(image => {
		const imageContainer = document.createElement('div');

		imageContainer.class = 'imageContainer';
		imageContainer.innerHTML = buildImageTag(image, false);

		subContainer.appendChild(imageContainer);
	});

	listContainer.innerHTML = subContainer.innerHTML;
}

/**
 * Use the properties of the image object to populate the attributes
 * of the image tag.
 * @param {object} image - An object which contains an image's properties.
 * @param {boolean} isLarge - Flag which indicates which size image to show.
 */
function buildImageTag(image, isLarge) {
	const imgSize = isLarge ? 'b' : 'n';
	const className = isLarge ? 'fullImage' : 'previewImage';
	const tabIndex = !isLarge ? 'tabindex=0' : '';

	return `<img class=${className} src='https://c1.staticflickr.com/${image.farm}/${image.server}/${image.id}_${image.secret}_${imgSize}.jpg' alt='${image.title}' ${tabIndex} data-image-id="${image.id}"/>`;
}

function getNextImage() {
	currentIndex++;

	if (currentIndex === imageList.length) {
		currentIndex = 0;
	}

	setFullImage(currentIndex);
}

function getPreviousImage() {
	currentIndex--;

	if (currentIndex < 0) {
		currentIndex = imageList.length - 1;
	}

	setFullImage(currentIndex);
}

/**
 * Prompt for an API endpoint for the user and return a promise with
 * the result of the call.
 */
function getImages() {
	let apiEndpoint = sessionStorage.getItem('apiEndpoint');

	if (!apiEndpoint) {
		apiEndpoint = prompt("Please enter the url provided in https://www.flickr.com/services/api/explore/flickr.photosets.getPhotos (You can use photoset_id=72157625123508939");
	}

	sessionStorage.setItem('apiEndpoint', apiEndpoint);

	return new Promise(function(resolve, reject) {
		const request = new XMLHttpRequest();
		request.open('GET', apiEndpoint);
		request.responseType = 'json';
		request.onload = function() {
			if (request.status === 200) {
				resolve(request.response);
			} else {
				reject(Error(`Something went wrong with the request:${request.statusText}`));
			}
		};
		request.onerror = function() {
			reject(Error('Something went wrong with your request.'));
		};

		request.send();
	});
}

/**
 * Populate the lightbox description and index for display on the page.
 * @param {number} imageIndex - An index of the imageList array.
 */
function setFullImage(imageIndex) {
	const imageContainer = document.getElementById('imageContainer');
	const imageTitleContainer = document.getElementById('imageDescription');
	const imageIndexContainer = document.getElementById('imageIndex');

	currentIndex = imageIndex;
	imageTitleContainer.innerText = imageList[imageIndex].title;
	imageContainer.innerHTML = buildImageTag(imageList[imageIndex], true);
	imageIndexContainer.innerText = imageIndex + 1;
}

/**
 * Find the image in the imageList collection
 * @param {number} imageId - An id to match against the images' id's.
 */
function showLightbox(imageId) {
	const lightbox = document.getElementById('lightbox');

	for (let i = 0; i < imageList.length; i++) {
		if (imageList[i].id === imageId) {
			setFullImage(i);
			break;
		}
	}

	lightbox.classList.add('show');
}

/**
 * Add all the event listeners to the document
 * Make the API call and populate imageList
 */
function init() {
	const imageGrid = document.getElementById('imageGrid');
	const lightbox = document.getElementById('lightbox');

	imageGrid.addEventListener('click', () => {
		if (event.target.classList.contains('previewImage')) {
			showLightbox(event.target.dataset.imageId);
		}
	});

	imageGrid.addEventListener('keyup', () => {
		if (event.target.classList.contains('previewImage') && (event.key === 'Enter')) {
			showLightbox(event.target.dataset.imageId);
		}
	});

	lightbox.addEventListener('click', () => {
		if (event.target.classList.contains('closeButton')) {
			lightbox.classList.remove('show');
		}

		if (event.target.classList.contains('next')) {
			getNextImage();
		}

		if (event.target.classList.contains('previous')) {
			getPreviousImage();
		}
	});

	document.body.addEventListener('keyup', () => {
		if (event.key === 'Escape') {  // esc
			lightbox.classList.remove('show');
		}

		if (event.key === 'ArrowLeft') {  // left
			getNextImage();
		}

		if (event.key === 'ArrowRight') {  // right
			getPreviousImage();
		}
	});

	getImages()
		.then(({ photoset }) => {
			if (photoset) {
				imageList = photoset.photo;
				document.getElementById('imageTotal').innerText = imageList.length;
				buildGrid();
			} else {
				alert("Something went wrong with your request.");
				// Clear sessionStorage for the case that the endpoint is bad.
				sessionStorage.clear();
			}
		})
		.catch(err => {
			alert(err.message);
			sessionStorage.clear();
		});
}

init();