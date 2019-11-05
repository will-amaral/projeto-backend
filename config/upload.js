/**
 * Aqui configuramos o upload de arquivos de imagem, que serão utilizados principalmente
 * para o upload das fotos do perfil dos usuários. Para isso, o módulo multer configura
 * a definição de um local para o aramazenamento das imagens.
 */
const multer = require('multer');
const path = require('path');

module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', 'public', 'uploads'),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    }
  })
};
