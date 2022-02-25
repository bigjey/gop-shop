import React from 'react';
import { Button } from 'react-bootstrap';
import { ProductWithIncludes } from '../../../shared/types';
import { imageUrl, processFetchResponse } from '../../../shared/utils';
import { deleteProductImage } from '../../api/productImages';

export const ProductGalleryForm: React.FC<{
  product: ProductWithIncludes;
  onChange?: () => void;
}> = (props) => {
  const { product, onChange } = props;
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [deletingId, setDeletingId] = React.useState<number>();
  const fileRef = React.createRef<HTMLInputElement>();

  const onUploadClick = () => {
    if (!fileRef.current?.files?.length) {
      return;
    }

    const data = new FormData();
    for (const file of fileRef.current.files) {
      data.append('images', file);
    }

    setUploading(true);

    fetch(`/api/products/${product.id}/gallery`, {
      method: 'post',
      body: data,
    })
      .then(processFetchResponse)
      .then((response) => {
        console.log(response);
        if (fileRef.current) {
          fileRef.current.files = null;
        }
        setFiles(null);
        if (onChange) {
          onChange();
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const onDeleteClick = (id: number) => {
    if (confirm('Delete this image?')) {
      setDeletingId(id);
      deleteProductImage(product.id, id)
        .then(() => {
          if (onChange) {
            onChange();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setDeletingId(undefined);
        });
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {product.images?.map((img) => (
          <div
            key={img.id}
            className="mb-2"
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 150,
              margin: 10,
              opacity: deletingId === img.id ? 0.5 : 1,
            }}
          >
            <img
              src={imageUrl(img.publicId, {
                resize: { width: 150, height: 150 },
              })}
              style={{
                border: '2px solid #ccc',
              }}
              alt=""
            />
            <div style={{ textAlign: 'center', padding: 5 }}>
              <Button
                size="sm"
                onClick={() => onDeleteClick(img.id)}
                disabled={deletingId === img.id}
                variant="danger"
              >
                &times;
              </Button>
            </div>
          </div>
        ))}
        {!product.images?.length && (
          <>There are noimages for this product yet</>
        )}
      </div>
      <br />
      <br />
      <input
        id="files"
        type="file"
        name="images"
        multiple
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={(e) => setFiles(e.target.files)}
        disabled={uploading}
      />
      <label htmlFor="files">
        <Button variant="outline-link" as="span">
          Select files... {files?.length ? `(${files.length} selected)` : ''}
        </Button>
      </label>{' '}
      <Button onClick={onUploadClick} disabled={uploading || !files?.length}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </>
  );
};
