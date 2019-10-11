/**
 * Aqui definimos o controlador responsável pelo envio
 * de uma lista de usuários. Inicialmente importamos todos os módulos
 * nativos e definidos pelo usuário.
 */
const User = require('../models/User');
/**
 * A função read retorna os dados de todos os perfis cadastrados
 */
exports.read = async (req, res, next) => {
  const students = await User.find({ level: 'Aluno' });
  const instructors = await User.find({ level: 'Instrutor' });
  res.json({ students, instructors });
  next();
};
