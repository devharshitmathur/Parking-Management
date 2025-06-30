import { diskStorage, memoryStorage } from 'multer';

export const MulterConfig = {
  dest: './uploads',
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
};

export const documentsMulterConfig = {
  storage: memoryStorage(), // Use memoryStorage to get file.buffer
  // limits: {
  //   fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  // },
  // fileFilter: (req, file, cb) => {
  //   const validMimeTypes = [
  //     // Text file types
  //     'text/plain',                      // .txt
  //     'text/csv',                        // .csv
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  //     'application/pdf',                 // .pdf
  //     'application/msword',              // .doc
  //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx

  //     // Image file types
  //     'image/jpeg',                      // .jpg, .jpeg
  //     'image/png',                       // .png
  //   ];
  //   if (validMimeTypes.includes(file.mimetype)) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Invalid file type. Only Excel, PDF, and image files are allowed.'));
  //   }
  // }
};

