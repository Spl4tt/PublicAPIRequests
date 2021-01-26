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
    console.log(userList); // TODO Remove
    createCards(userList);

    // Set click event listener on each card
    const cards = document.querySelectorAll('.card');

    function showModalWindow(event) {
        let element = event.target;
        while(element.className !== 'card') {
            element = element.parentElement;
        }
        // Get a User from list
        const user = userList[element.id];

        // Format number to (555) 555-5555
        let number = user.cell;
        const cleaned = ('' + user.phone).replace(/\D/g, '') // Clean number
        const regex = /^(\d{3})(\d{3})(\d{4})$/;
        const match = cleaned.match(regex)
        if (match) {
            number = '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }

        // Format Birthday
        const birthday = new Date(user.dob.date).toLocaleDateString();

        // Add HTML
        const modalHTML = `<div class="modal-container" id="modal">
                                <div class="modal">
                                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                                    <div class="modal-info-container">
                                        <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                                        <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                                        <p class="modal-text">${user.email}</p>
                                        <p class="modal-text cap">${user.location.city}</p>
                                        <hr>
                                        <p class="modal-text">${number}</p>
                                        <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.state}, ${user.location.postcode}</p>
                                        <p class="modal-text">Birthday: ${birthday}</p>
                                    </div>
                                </div>
                            </div>`;
        body.insertAdjacentHTML('beforeend', modalHTML)

        // Add close button listener
        const modal = document.getElementById('modal');
        const closeButton = document.getElementById('modal-close-btn');
        closeButton.addEventListener('click', event => modal.parentNode.removeChild(modal));
    }

    cards.forEach(card => card.addEventListener('click', event => showModalWindow(event)));
});

/**
 * Creates the usercards and appends them to the gallery
 * @param userList
 */
function createCards(userList) {
    // Loop through the list of users and create a card in the gallery for each of them
    // userList.forEach(user => gallery.insertAdjacentHTML('beforeend', createCardLiteral(user)));
    for(let i = 0; i<userList.length; i++) {
        gallery.insertAdjacentHTML('beforeend', createCardLiteral(userList[i], i))
    }
}

/**
 * Creates a template literal for the Card with basic user information
 * @param user
 */
function createCardLiteral(user, id) {
    return`<div class="card" id="${id}">
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