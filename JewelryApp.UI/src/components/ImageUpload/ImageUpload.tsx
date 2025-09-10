import { useCallback } from "react";
import { Col, Row } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { FaTrash } from "react-icons/fa";
import "./imageUpload.scss";

const ImageUpload = ({ files, setFiles }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setFiles((prev) => [...prev, ...newFiles]); // keep existing + new
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true, // allow multiple
  });

  const handleRemoveImage = (event, index) => {
    event.stopPropagation();
    const filteredFiles = files.filter((_, i) => i !== index);
    setFiles(filteredFiles);
  };

  return (
    <div className="imageUpload">
      <label className="form-label required"> Product Images</label>

      <div {...getRootProps()}>
        <input {...getInputProps()} />

        {files?.length > 0 && !isDragActive ? (
          <Row>
            {files.map((file, index) => (
              <Col xs={4} className="droppedImageWrapper p-3">
                <img
                  key={index}
                  src={file.preview}
                  alt={`Preview ${index}`}
                  style={{ width: "100%", height: "300px" }}
                />
                <FaTrash
                  className="closeIcon"
                  onClick={(event) => handleRemoveImage(event, index)}
                />
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
                <br />
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
