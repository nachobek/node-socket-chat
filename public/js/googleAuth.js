const url = 'http://localhost:8080/api/auth/';

const loginForm = document.getElementById('customSignIn');


// Custom Sign In

loginForm.addEventListener('submit', ev => {
    ev.preventDefault();

    const formData = {};

    for (let element of loginForm.elements) {
        if (element.name.length > 0) {
            formData[element.name] = element.value; // In formData object, create a property named with the value "element.name" and assign the value of that element.
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
        .then(resp => resp.json())
        .then(({msg, errors, token}) => { // Destructure msg OR errors OR token from the response. Per our backend design, if there is any error, there could be either an "errors" OR "msg" attribute. Else, we'll grab the token.
            if (msg) {
                return console.error('Error(s): \n', msg);
            }

            if (errors) {
                return console.error('Error(s): \n', errors);
            }

            if (token) {
                localStorage.setItem('token', token);
                window.location = 'chat.html';
            }
        })
        .catch(err => {
            return console.error('Unhandled Error: \n', err)
        });
});


// Google Sign In / Sign Out

function handleCredentialResponse(response) {
    // Google Token / ID_TOKEN
    // console.log('id_token:', response.credential);

    // Google sends back the ID Token in the response.credential field.
    // We extract it into a variable, so it can be passed to the backend in the body by using the fetch() API.
    const id_token = { id_token: response.credential };
    
    fetch(url + 'google', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(id_token)
    })
        .then(resp => resp.json()) // Extracting the response is another promise, so we need an additional .then to handle what to do with the response.
        // .then((resp) => {
        //     // console.log('Response:', resp);
        //     localStorage.setItem('email', resp.user.email);
        // })
        .then(({token}) => {
            // console.log('Token:', token);
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);
}

const signOutButton = document.getElementById('g_id_signout');

signOutButton.onclick = () => {
    google.accounts.id.revoke(localStorage.getItem('token'), done => {
        localStorage.clear();
        location.reload();
    });
}