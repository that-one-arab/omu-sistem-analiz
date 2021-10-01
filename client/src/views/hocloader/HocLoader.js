import "./loader.css"

const HocLoader = (props) => {
    if (props.absolute)
      return (
        <div >
          <div className={ props.isLoading ? "loader loader-absolute" : ""}>
            <div className={ props.isLoading ? "spinner-border" : ""} role="status">
              {/* <span className="sr-only loader-icon">Loading...</span> */}
            </div>
          </div>
          {
            props.children
          }
        </div>
      )
    else if (props.relative)
      return (
        <div className = "relativePosition">
          <div className={ props.isLoading ? "loader loader-relative" : ""}>
            <div className={ props.isLoading ? "spinner-border" : ""} role="status">
              {/* <span className="sr-only loader-icon">Loading...</span> */}
            </div>
          </div>
          {
            props.children
          }
        </div>
      )
}

export default HocLoader;