/**
 * Este arquivo define funções auxiliares para as rotas. Elas tratam a validação
 * de erros.
 */

const { validationResult } = require('express-validator');
/**
 *  Essa é a função responsável pela validação dos dados e envio da resposta de erro.
 * Ela utiliza a função validationResult do pacote express-validator,
 * que trata os erros e os formata apropriadamente.
 */
exports.validateErrors = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  next();
};
/**
 * A função de validação de cpf é uma função que utilizamos na criação de usuários.
 * A primeira etapa da função elimina CPFs invalidos conhecidos, e prossegue
 * para a validação dos dois dígitos verificadores.
 */
exports.cpfValidate = function(cpf) {
  if (
    cpf.length != 11 ||
    cpf == '00000000000' ||
    cpf == '11111111111' ||
    cpf == '22222222222' ||
    cpf == '33333333333' ||
    cpf == '44444444444' ||
    cpf == '55555555555' ||
    cpf == '66666666666' ||
    cpf == '77777777777' ||
    cpf == '88888888888' ||
    cpf == '99999999999'
  )
    return false;
  // Valida 1o digito
  let add = 0;
  let rev;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(9))) return false;
  // Valida 2o digito
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(10))) return false;
  return true;
};
