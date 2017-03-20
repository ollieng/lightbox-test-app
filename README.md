# lightbox-test-app
Display photo thumbnails and lightbox for enlarged photo and title.

This app uses the https://www.flickr.com/services/api/explore/flickr.photosets.getPhotos API to fetch a photoset from a given photoset id.

Instructions for use:
1. Go to https://www.flickr.com/services/api/explore/flickr.photosets.getPhotos.
2. Add a photoset_id (72157625123508939 is known to be good), set the output to JSON, select "Do not sign call" and click the "Call Method..." button.
3. The call will generate a URL at the bottom of the page, which should be copied for use with the app.
4. Hit the app at https://lightbox-test-app.herokuapp.com/index.html and enter the URL from (3) when prompted.

Notes:  
* Thumbnails are keyboard navigable by tabbing through each.
* When the lightbox is up, the left and right arrow keys can be used to navigate, and the esc key can be used to close the lightbox.
* sessionStorage is used to cache the API URL to prevent the prompt from coming up again until the browser window is closed.
