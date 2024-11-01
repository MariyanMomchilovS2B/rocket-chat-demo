const axios = require('axios');

async function registerUsers() {
  const numberOfUsers = process.env.users ?? 10;
  const registrations = [];
  for (let i = 0; i < numberOfUsers; i++) {
    registrations.push(
      axios.post('http://localhost:3000/api/v1/users.register', {
        username: `user${(i + 1) * numberOfUsers}`,
        email: `user${(i + 1) * numberOfUsers}@email.com`,
        pass: `user${(i + 1) * numberOfUsers}`,
        name: `User user${(i + 1) * numberOfUsers}`,
      })
    );
  }
  await Promise.all(registrations);
}

registerUsers();
