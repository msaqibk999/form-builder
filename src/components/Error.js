const Error = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "5rem",
        fontSize: "1.2rem",
        fontWeight: "bold",
      }}
    >
      No routes match the URL 💔
    </div>
  );
};

export default Error;
