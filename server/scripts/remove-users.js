const axios = require('axios');
let axiosInstance;

async function fetchAndRemove() {
  let total;
  let userCount = 0;
  let offset = 0;
  do {
    const { users, total: allUsers } = await getUsers(offset);
    total = total || allUsers;
    userCount += users.length;
    offset += 50;
    await Promise.all(
      users
        .filter(
          (user) => !user.roles.includes('admin') && !user.roles.includes('bot')
        )
        .map(({ _id }) => deleteUser(_id))
    );
  } while (userCount < total);
}

async function getUsers(offset) {
  const userResp = await axiosInstance.get(
    'http://localhost:3000/api/v1/users.list',
    {
      params: {
        offset,
        query: '{ "name": { "$regex": "user" } }',
        fields: '{"_id": 1}',
      },
    }
  );
  const { users, count, total } = userResp.data;
  return { users, count, total };
}

async function deleteUser(id) {
  await axiosInstance.post('http://localhost:3000/api/v1/users.delete', {
    userId: id,
  });
}

async function adminLogIn() {
  const user = process.env.user;
  const password = process.env.pass;

  const resp = await axios.post('http://localhost:3000/api/v1/login', {
    user,
    password,
  });
  axiosInstance = axios.create({
    headers: {
      'X-Auth-Token': resp.data.data.authToken,
      'X-User-Id': resp.data.data.userId,
    },
  });
}

adminLogIn().then(fetchAndRemove);
