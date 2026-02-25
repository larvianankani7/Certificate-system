import React from "react";

export default function CertificateTemplate({ data }) {
  if (!data) return null;

  return (
    <div className="d-flex justify-content-center">
      <div
        id="certificate"
        className="p-5 shadow-lg"
        style={{
          width: "1100px",
          height: "750px",
          background: "linear-gradient(135deg, #021a1f, #043f4a)",
          color: "#e6fbff",
          border: "10px solid #00e5ff",
          borderRadius: "18px",
          position: "relative",
          fontFamily: "'Georgia', serif"
        }}
      >
        {/* LOGO */}
        <div className="text-center mb-4">
          <img
            src="/logo.png"
            alt="Institute Logo"
            style={{ height: "80px" }}
          />
        </div>

        {/* TITLE */}
        <h1 className="text-center text-info fw-bold mb-2">
          CERTIFICATE OF COMPLETION
        </h1>

        <p className="text-center fst-italic">
          This certificate is proudly presented to
        </p>

        {/* STUDENT NAME */}
        <h2 className="text-center fw-bold mt-3 mb-3 text-light text-uppercase">
          {data.studentName}
        </h2>

        {/* BODY */}
        <p className="text-center fs-5 px-5">
          for successfully completing the
          <span className="fw-bold text-info"> {data.course} </span>
          program conducted by
          <span className="fw-bold"> CertifyX Training Authority</span>.
          This accomplishment reflects dedication, commitment, and
          professional excellence.
        </p>

        {/* DATE */}
        <p className="text-center mt-3">
          Issued on <b>{new Date(data.generatedAt).toDateString()}</b>
        </p>

        {/* FOOTER */}
        <div
          className="d-flex justify-content-between align-items-end"
          style={{
            position: "absolute",
            bottom: "40px",
            left: "60px",
            right: "60px"
          }}
        >
          {/* CERT ID */}
          <div>
            <p className="mb-1">
              <b>Certificate ID</b>
            </p>
            <p>{data.certificateId}</p>
          </div>

          {/* SIGNATURE */}
          <div className="text-end">
            <img
              src="/signature.png"
              alt="Authorized Signature"
              style={{ width: "160px" }}
            />
            <p className="mb-0">Authorized Signatory</p>
            <b>CertifyX Authority</b>
          </div>
        </div>
      </div>
    </div>
  );
}
