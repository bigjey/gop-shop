import { CloudinaryImage } from '@cloudinary/url-gen';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';

export async function processFetchResponse(r: Response) {
  if (r.status === 200) {
    return r.json();
  }

  return Promise.reject({
    status: r.status,
    message: await r.text(),
  });
}

export function imageUrl(
  publicId: string,
  options: {
    resize?: {
      width?: number;
      height?: number;
    };
  } = {}
): string {
  const { resize } = options;
  let img = new CloudinaryImage(publicId, {
    cloudName: 'hewlpuky3',
  });

  if (resize && (resize.width || resize.height)) {
    let resizeConfig = thumbnail();
    if (resize.width) {
      resizeConfig = resizeConfig.width(resize.width);
    }
    if (resize.height) {
      resizeConfig = resizeConfig.height(resize.height);
    }
    img = img.resize(resizeConfig);
  }

  return img.toURL();
}
