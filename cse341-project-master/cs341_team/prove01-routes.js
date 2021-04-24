const fs = require('fs');

const requestHandler = (request, response) => {
    const url = request.url;
    const method = request.method;
    if (url === '/') {
        response.setHeader('Content-Type', 'text/html');
        response.write('<html>');
        response.write('<head><title>User List</title></head>');
        response.write('<body>');
        response.write('<h1>Welcome to Prove01!</h1>');
        response.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form>')
        response.write('</body></html>');
        return response.end(); // Gets sent back here
    }
    if (url === '/users') {
        const users = fs.readFileSync('users.txt');
        response.setHeader('Content-Type', 'text/html');
        response.write('<html>');
        response.write('<head><title>User List</title></head>');
        response.write('<body>');
        response.write(`<ul>${users}</ul>`);
        // response.write('<form action="/create-user"><input type="text" method="POST"><button type="submit">Send</button></form>')
        response.write('</body></html>');
        return response.end(); // Gets sent back here
    }
    if (url === '/create-user' && method === 'POST') {
        const body = [];
        request.on('data', (chunk) => {
            body.push(chunk); // Get all of the data from the POST request
        });
        return request.on('end', () => {                       // Function that will run at the end
            const parsedBody = Buffer.concat(body).toString(); // Write it into the body using a buffer
            const user = parsedBody.split('=')[1];             // Before modification, the string looks like "message=userinput"
            fs.appendFileSync('users.txt', `<li>${user}</li>`);
            console.log(user);
            response.statusCode = 302;
            response.setHeader('Location', '/');
            return response.end(); // Gets sent back here
        });
    }
    response.setHeader('Content-Type', 'text/html');
    response.write('<html>');
    response.write('<head><title>Some page, bb</title></head>');
    response.write('<body><h1>A Header!</h1></body>');
    response.write('</html>');
    response.end(); // Gets sent back here
};

module.exports = requestHandler;
