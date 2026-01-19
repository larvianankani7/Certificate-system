import React from "react";

export default function CertificateTemplate({ data }) {
  if (!data) return null;

  return (
    <div
      id="certificate"
      className="p-5"
      style={{
        width: "1000px",
        height: "700px",
        background: "linear-gradient(135deg,#021a1f,#03343f)",
        color: "#e6f9ff",
        border: "8px solid #00e5ff",
        borderRadius: "20px",
        position: "relative",
        fontFamily: "Georgia, serif"
      }}
    >
      <h1 className="text-center text-info fw-bold">
        Certificate of Completion
      </h1>

      <p className="text-center mt-4 fs-5">
        This is to certify that
      </p>

      <h2 className="text-center fw-bold mt-2">
        {data.studentName}
      </h2>

      <p className="text-center mt-3 fs-5">
        has successfully completed the internship in
      </p>

      <h4 className="text-center text-info fw-bold">
        {data.domain}
      </h4>

      <p className="text-center mt-3">
        from <b>{data.startDate}</b> to <b>{data.endDate}</b>
      </p>

      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "60px"
        }}
      >
        <p><b>Certificate ID:</b> {data.certificateId}</p>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "60px",
          textAlign: "right"
        }}
      >
        <p className="mb-1">Authorized Signature</p>
        <b>CertifyX Authority</b>
      </div>
    </div>
  );
}
