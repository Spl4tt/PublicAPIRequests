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
    //au,br,ca,ch,de,dk,es,fi,fr,gb,ie,ir,no,nl,nz,tr,us')
    fetchData('https://randomuser.me/api/?results=12&nat=au,ch,de,fi,fr,gb,nl,nz,us')
])
.then(data => {
    const userList = data[0].results;
    console.log(userList); // TODO Remove
    createCards(userList);

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', event => {
        // Getting the clicked user:
        // Go up to the card element - Else we're on the wrong element
        let element = event.target;
        while(element.className !== 'card') {
            element = element.parentElement;
        }
        // Get a User from list
        const userId = element.id;
        const user = userList[userId-1];
        refreshModal(user, userId, userList.length);
    }));

    // Create Search with all needed functionality
    createSearch();
});

/**
 * Removes the modal, and refreshes it with new values
 * @param user
 * @param currentUserId
 * @param userCount
 */
function refreshModal(user, currentUserId, userCount) {
    removeModal();

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

    // Create HTML with all values
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
                            <div class="modal-btn-container">
                                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                                <button type="button" id="modal-next" class="modal-next btn">Next</button>
                            </div>
                        </div>`;
    // Insert the HTML
    body.insertAdjacentHTML('beforeend', modalHTML);

    // Add listeners
    // Close button listener
    const closeButton = document.getElementById('modal-close-btn');
    closeButton.addEventListener('click', event => removeModal());

    // Switch button listeners
    const prevButton = document.getElementById('modal-prev');
    if(parseInt(currentUserId)===1) {
        prevButton.style.display = 'none';
    }
    const nextButton = document.getElementById('modal-next');
    if(parseInt(currentUserId)===userCount) {
        nextButton.style.display = 'none';
    }
    prevButton.addEventListener('click', event => {

    });
    nextButton.addEventListener('click', event => {

    });
}

/**
 * removes the modal, if it is up
 */
function removeModal() {
    const modal = document.getElementById('modal');
    if(modal) {
        modal.parentNode.removeChild(modal);
    }
}

/**
 * Creates the usercards and appends them to the gallery
 * @param userList
 */
function createCards(userList) {
    // Loop through the list of users and create a card in the gallery for each of them
    // userList.forEach(user => gallery.insertAdjacentHTML('beforeend', createCardLiteral(user)));
    for(let i = 0; i<userList.length; i++) {
        gallery.insertAdjacentHTML('beforeend', createCardLiteral(userList[i], i+1))
    }
}

/**
 * Creates a template literal for the Card with basic user information
 * @param user
 * @param id
 */
function createCardLiteral(user, id) {
    return `<div class="card" id="${id}">
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

function createSearch() {
    const cards = document.querySelectorAll('.card');
    const searchDiv = document.querySelector('.search-container');
    const searchHTML = `<form action="#" method="get">
                            <input type="search" id="search-input" className="search-input" placeholder="Search...">
                            <input type="submit" value="&#x1F50D;" id="search-submit" className="search-submit">
                        </form>`;
    searchDiv.insertAdjacentHTML('beforeend', searchHTML);
    const input = document.getElementById('search-input');

    input.addEventListener('keyup', event => {
        cards.forEach(card => {
            const name = card.querySelector('#name').textContent.toLowerCase();
            const searchString = event.target.value.toLowerCase();
            // If it does not match, hide the card
            if(name.includes(searchString)) {
                card.style.display = 'flex';
            }
            else {
                card.style.display = 'none';
            }
        });
    })
}