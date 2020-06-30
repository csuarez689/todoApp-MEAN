const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storageTaskImage = multer.diskStorage({
	destination: (req, file, cb) => {
		let userPath = path.join(__dirname, `../uploads/${req.userId}/`);
		!fs.existsSync(userPath) && fs.mkdirSync(userPath);
		cb(null, userPath);
	},
	filename: (req, file, cb) => {
		let filename = `${Date.now()}-${file.originalname.replace(/ /g, '')}`;
		cb(null, filename);
	},
});

const fileFilter = (req, file, cb) => {
	const error = new Error();
	error.status = 422;
	error.name = 'ValidationError';
	if (file) {
		const match = ['image/png', 'image/jpeg', 'image/jpg'];
		if (match.indexOf(file.mimetype) === -1) {
			error.message = {
				imagen: 'Formato de imagen invalido. Solo se acepta png / jpg / jpeg',
			};
			return cb(error, null);
		}
	}
	cb(null, true);
};

const uploadFile = multer({
	storage: storageTaskImage,
	limits: {
		file: 1,
		fileSize: 1048576,
	},
	fileFilter: fileFilter,
}).single('imagen');

module.exports = uploadFile;
