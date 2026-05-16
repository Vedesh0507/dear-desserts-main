const axios = require('axios');
const FormData = require('form-data'); // Node environment needs form-data package

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

const form = new FormData();
form.append('name', 'Lasagna Veg');
form.append('price', 140);
// Imagine a file is appended
form.append('image', Buffer.from('test'), { filename: 'test.png' });

console.log("Axios version:", require('axios/package.json').version);

api.post('https://httpbin.org/post', form)
  .then(res => {
    console.log("Request Headers Sent:");
    console.log(res.data.headers);
    console.log("Body Sent:");
    console.log(res.data.data);
  })
  .catch(err => console.error(err.message));
