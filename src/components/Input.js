import { useEffect, useRef } from "react";

function Input({ location, onChangeLocation }) {
  const focusElement = useRef(null);

  useEffect(() => {
    function callback(e) {
      if (e.code === "Enter") {
        focusElement.current.focus();
      }
    }

    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Search from location..."
        value={location}
        onChange={e => onChangeLocation(e.target.value)}
        ref={focusElement}
      />
    </div>
  );
}

export default Input;
