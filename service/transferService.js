const userRepository = require('../repository/userRepository');
const transferRepository = require('../repository/transferRepository');

exports.transfer = (req, res) => {
  const { from, to, amount } = req.body;
  if (!from || !to || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Dados obrigatórios para transferência.' });
  }
  const sender = userRepository.findByUsername(from);
  const recipient = userRepository.findByUsername(to);
  if (!sender || !recipient) {
    return res.status(400).json({ error: 'Usuário remetente ou destinatário não encontrado.' });
  }
  if (!recipient.favorecido && amount >= 5000) {
    return res.status(400).json({ error: 'Transferência acima de R$ 5.000,00 só para favorecidos.' });
  }
  transferRepository.addTransfer({ from, to, amount });
  res.status(200).json({ message: 'Transferência realizada.' });
};
