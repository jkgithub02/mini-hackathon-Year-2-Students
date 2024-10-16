import React from "react";

const Error = ({ err }) => {
  return (
    <div className="errorMessage">
      An error occurred - "{err.message}". Refresh the page and try again later.
    </div>
  );
};

// function Error(props) {
//   return (
//     <div>
//       <h3>An error occurred - "{props.err.message}".</h3>
//       <p>Refresh the page and try again later.</p>
//     </div>
//   );
// }

export default Error;
