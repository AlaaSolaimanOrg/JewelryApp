import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./imageUpload.scss";
import { Col, Row } from "react-bootstrap";

const ImageUpload = ({files, setFiles}) => {

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

  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Product Images
      </label>

      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 h-40 cursor-pointer transition
          ${
            isDragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
      >
        <input {...getInputProps()} />

        {files.length > 0 ? (
          <Row>
            {files.map((file, idx) => (
              <Col xs={4}>
                <img
                  key={idx}
                  src={file.preview}
                  alt={`Preview ${idx}`}
                  style={{ width: "100%", height: "300px" }}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center text-gray-500 text-sm">
            Drag & drop images or{" "}
            <span className="text-yellow-600 font-medium">browse</span>
            <br />
            <span className="text-xs text-gray-400">
              Recommended size: 500x500px
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
