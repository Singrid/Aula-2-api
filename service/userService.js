const userRepository = require('../repository/userRepository');

exports.register = (req, res) => {
  const { username, password, favorecido } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });
  }
  if (userRepository.findByUsername(username)) {
    return res.status(400).json({ error: 'Usuário já existe.' });
  }
  userRepository.addUser({ username, password, favorecido: !!favorecido });
  res.status(201).json({ message: 'Usuário registrado.' });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });
  }
  const user = userRepository.findByUsername(username);
  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Credenciais inválidas.' });
  }
  res.status(200).json({ message: 'Login realizado.' });
};

exports.getAll = (req, res) => {
  res.status(200).json(userRepository.getAllUsers());
};
