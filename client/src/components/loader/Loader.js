import "./loader.css"

const Loader = (props) => {
  if (props.isloading) {
    return (
      <div className={ props.isLoading ? "loader" : ""}>
          <div className={ props.isLoading ? "spinner-border" : ""} role="status">
            {/* <span className="sr-only loader-icon">Loading...</span> */}
          </div>
      </div>
    )
  } else {
    return (
    <div className="loader">
      <div className="spinner-border" role="status">
        <span className="sr-only loader-icon">Loading...</span>
      </div>
    </div>      
    )
    }
}

export default Loader;