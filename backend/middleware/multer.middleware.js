import multer from 'multer'


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage });

export default upload;



// -------------------------------File Type Validation (Very Important)

// const upload = multer({ storage: storage })

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png"];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPG & PNG allowed"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
// });
