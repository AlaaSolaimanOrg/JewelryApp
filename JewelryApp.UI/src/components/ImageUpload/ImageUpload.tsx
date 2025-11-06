import { useCallback } from "react";
import { Col, Row } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { FaTrash } from "react-icons/fa";
import { convertHeicToJpeg } from "../../utils";
import "./imageUpload.scss";
import imageCompression from "browser-image-compression";

const ImageUpload = ({ files, setFiles }) => {
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          let processedFile = file;
          
          // Convert HEIC/HEIF to JPEG
          if (file.name.toLowerCase().endsWith('.heic') || 
              file.name.toLowerCase().endsWith('.heif')) {
            processedFile = await convertHeicToJpeg(file);
          }
          
          // Compress image
          const compressed = await imageCompression(processedFile, {
            maxSizeMB: 2,
          });
          
          // Create a new File object with proper name and extension
          const originalName = file.name;
          const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
          const finalFileName = `${nameWithoutExt}.jpg`;
          
          const finalFile = new File([compressed], finalFileName, {
            type: 'image/jpeg',
            lastModified: new Date().getTime()
          });
          
          return Object.assign(finalFile, {
            preview: URL.createObjectURL(finalFile),
          });
        })
      );

      setFiles((prev) => [...prev, ...processedFiles]);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".heic", ".heif"],
    },
    multiple: true,
  });

  const handleRemoveImage = (event, index) => {
    event.stopPropagation();
    const filteredFiles = files.filter((_, i) => i !== index);
    setFiles(filteredFiles);
  };

  return (
    <div className="imageUpload">
      <label className="form-label required">Product Images</label>

      <div {...getRootProps()}>
        <input {...getInputProps()} />

        {files?.length > 0 && !isDragActive ? (
          <Row>
            {files.map((file, index) => (
              <Col key={index} xs={4} className="droppedImageWrapper p-3">
                <img
                  src={file.preview}
                  alt={`Preview ${index}`}
                  style={{ width: "100%", height: "300px", objectFit: "cover" }}
                />
                <FaTrash
                  className="closeIcon"
                  onClick={(event) => handleRemoveImage(event, index)}
                />
                {/* Debug: Show file name */}
                <div style={{ fontSize: '12px', marginTop: '5px' }}>
                  {file.name}
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <div className={`imageUploadZone ${isDragActive ? "dragZone" : ""}`}>
            {isDragActive ? (
              <p>Drop images here</p>
            ) : (
              <p>
                <span>Drag & drop images or </span>
                <span className="browse">browse</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;