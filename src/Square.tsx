import React from "react";
import "./Square.css";

export interface SquareProps {
  value: number;
}

export const Square = (props: SquareProps) => {
  const [shouldDisplay, setDisplay] = React.useState(false);
  const toggle = () => {
    setDisplay(true);
  };

  return (
    <div className="Square" onClick={toggle}>
      {shouldDisplay && props.value}
    </div>
  );
};
