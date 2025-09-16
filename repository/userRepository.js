const users = [];

exports.addUser = (user) => {
  users.push(user);
};

exports.findByUsername = (username) => {
  return users.find(u => u.username === username);
};

exports.getAllUsers = () => {
  return users;
};
