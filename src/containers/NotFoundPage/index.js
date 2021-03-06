import React from 'react';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';

import Button from 'Button';
import H1 from 'H1';

function NotFound(props) {
  return (
    <article>
      <H1>Page not found.</H1>
      <Button
        handleRoute={function redirect() {
          props.changeRoute('/');
        }}
      >
        Home
      </Button>
    </article>
  );
}

// react-redux stuff
function mapStateToProps(state) {
  return {
    location: state.get('route').location,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(routeActions.push(url)),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
