import { Outlet, useLocation } from "react-router";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { useRef } from "react";
import "./AuthTransition.css";

const AuthTransition = () => {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <div className="auth-transition-container">
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={location.pathname}
          nodeRef={nodeRef}
          timeout={250}
          classNames="auth-slide"
          unmountOnExit
        >
          <div ref={nodeRef} className="auth-transition-wrapper">
            <Outlet />
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default AuthTransition;
