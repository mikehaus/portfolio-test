import React from 'react';
 
const ABOUT_STYLES = {
    main: {
      width: '95vw',
      overflowY: 'auto',
      overflowX: 'none',
      position: 'fixed',
      left: '65px',
      right: '50px',
      top: '10px',
      bottom: '10px',
      padding: '10px',
    },
}

class AboutView extends React.Component {
    render() { 

        if (!this.props.displayed) {
            return null;
        }

        return (
            <div style={ABOUT_STYLES.main}>
              <h1>Hi there!</h1>
            </div>
        );
    }
}
 
export default AboutView;