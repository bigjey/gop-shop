import cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload';

export function upload(file: fileUpload.UploadedFile) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        { public_id: file.name, format: file.mimetype.split('/')[1] },
        function (err, result) {
          if (err) {
            console.log({ err });

            reject(err);
          } else {
            // console.log({ result });
            resolve(result);
          }
        }
      )
      .end(file.data);
  });
}
