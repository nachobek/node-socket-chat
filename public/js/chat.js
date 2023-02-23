const url = 'http://localhost:8080/api/auth/';


let user = null;
let socket = null;


// HTML References
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulActiveUsers = document.querySelector('#ulActiveUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnSignOut = document.querySelector('#btnSignOut');


const validateJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        // window.location = 'index.html';
        throw new Error('No valid JWT found.');
    }

    // Another way of doing fetch and handle the promise response without using .then and .catch.
    const response = await fetch(url, {
        headers: {'x-token': token}
    });

    const {user: userResponse, token: tokenResponse} = await response.json();

    localStorage.setItem('token', tokenResponse);

    user = userResponse;

    document.title = user.name;

    await connectSocket();
}


const connectSocket = async () => {
    // The below statement will execute socketController, since it triggers a "connection" event - This is the default socket.io behavior.
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });


    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });


    // Socket events to handle chat interactions.
    socket.on('receive-message', (payload) => {
        renderMessages(payload);
    });


    // Since the first argument received in the callback function "(payload)" is the same argument in the function it executes "renderActiveUsers(payload)".
    // This whole function can be simplified as shown below.
    // socket.on('active-users', (payload) => {
    //     renderActiveUsers(payload);
    // });

    socket.on('active-users', renderActiveUsers);
    // -------------------------------------------------------


    socket.on('private-message', (payload) => {
        console.log('Private:', payload);
    });
}


const renderMessages = (messages = []) => {
    let messagesHtml = '';

    messages.forEach(({name, message}) => {
        messagesHtml += `
        <li>
            <p>
                <span class="text-primary">${name}</span>
                <span class="fs-6 text-muted">${message}</span>
            </p>
        </li>
        `;
    });

    ulMessages.innerHTML = messagesHtml;
}


const renderActiveUsers = (users = []) => {
    let usersHtml = '';

    users.forEach(({name, uid}) => {
        usersHtml += `
        <li>
            <p>
                <h5 class="text-success">${name}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        `;
    });

    ulActiveUsers.innerHTML = usersHtml;
}


txtMessage.addEventListener('keyup', (event) => {
    if (event.keyCode !== 13) {
        return;
    }

    if (txtMessage.value.length === 0) {
        return;
    }

    socket.emit('send-message', {message: txtMessage.value, targetUid: txtUid.value});

    txtMessage.value = '';
});


const main = async () => {
    await validateJWT();
}


main();