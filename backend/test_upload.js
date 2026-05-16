const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function test() {
  try {
    // We need to login first to get the token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@deardesserts.com', // Let's check DB or auth script for credentials
      password: 'admin123'
    });
    
    const token = loginRes.data.token;
    console.log('Logged in, token:', token);

    const form = new FormData();
    form.append('name', 'Lasagna Veg');
    form.append('description', 'Layers of rich cheesy goodness');
    form.append('price', '140');
    form.append('category', 'savories');
    form.append('isAvailable', 'true');
    form.append('isBestSeller', 'false');
    form.append('isSpecial', 'false');
    form.append('preparationTime', '15');
    
    // We can skip image or add a dummy one
    
    const res = await axios.post('http://localhost:5000/api/menu', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

test();
