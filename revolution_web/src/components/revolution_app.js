import AppBar from 'material-ui/AppBar';
import React from 'react';
import {connect} from 'react-redux';

const RevolutionApp = ({children, title}) => {
  return (
      <div>
          <AppBar title={title}/>
          {children}
      </div>
  );
};

const mapStateToProps = (state, ownProps) => {
    return {
        children: ownProps.children,
        title: state.revolutionApp.title
    };
};

export default connect(mapStateToProps)(RevolutionApp);