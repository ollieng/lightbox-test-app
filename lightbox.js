let imageList;
let currentIndex;

function buildGrid() {
	const listContainer = document.getElementById('imageGrid');

	imageList.forEach(image => {
		const imageContainer = document.createElement('div');

		imageContainer.class = 'imageContainer';
		imageContainer.innerHTML = buildImageTag(image, false);

		listContainer.appendChild(imageContainer);
	});
}

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

function getImages() {
	// const apiEndpoint = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=df8ff6da229b290a5c247cdb1bd0004d&photoset_id=72157625123508939&format=json&nojsoncallback=1';

	const apiEndpoint  = prompt("Please enter the url provided in https://www.flickr.com/services/api/explore/flickr.photosets.getPhotos");

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
			reject(Error('Something went horribly wrong.'));
		};

		request.send();
	});
}

function setFullImage(imageIndex) {
	const imageContainer = document.getElementById('imageContainer');
	const imageTitleContainer = document.getElementById('imageDescription');
	const imageIndexContainer = document.getElementById('imageIndex');

	currentIndex = imageIndex;
	imageTitleContainer.innerText = imageList[imageIndex].title;
	imageContainer.innerHTML = buildImageTag(imageList[imageIndex], true);
	imageIndexContainer.innerText = imageIndex + 1;
}

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
		if (event.target.classList.contains('fullImage')) {
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
			imageList = photoset.photo;
			document.getElementById('imageTotal').innerText = imageList.length;
			buildGrid();
		})
		.catch(err => {
			console.log(err.message);
		});
}

// Use 72157625123508939 for photoset id
init();