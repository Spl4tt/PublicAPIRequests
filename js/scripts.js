// Declarations
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');
/**
 * Error checker
 * @param response
 * @returns {Promise<never>|Promise<unknown>}
 */
function checkStatus(response) {
    if(response.ok) {
        return Promise.resolve(response);
    }
    else {
        return Promise.reject(new Error(response.statusText));
    }
}

/**
 * Fetch method
 * @param url
 * @returns {Promise<any | void>}
 */
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(error => console.log('Problemz', error));
}

// Fetch everything
Promise.all([
    fetchData('https://randomuser.me/api/?results=12')
])
.then(data => {
    const userList = data[0].results;
    createCards(userList);

    // TODO Create click events, like this?
    // const cards = document.querySelectorAll('.card');
    // cards.forEach(card => card.addEventListener('click', console.log('card clicked')));
});

/**
 * Creates the usercards and appends them to the gallery
 * @param userList
 */
function createCards(userList) {
    // Loop through the list of users and create a card in the gallery for each of them
    userList.forEach(user => gallery.insertAdjacentHTML('beforeend', createCardLiteral(user)));
}

/**
 * Creates a template literal for the Card with basic user information
 * @param user
 */
function createCardLiteral(user) {
    return`<div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${user.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="card-text">${user.email}</p>
                    <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                </div>
            </div>`;
}