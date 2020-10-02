import React from 'react'

const TIMER_STYLES = {
    main: {
      width: '90vw',
      height: '90vh',
      overflowY: 'auto',
      overflowX: 'none',
      position: 'fixed',
      left: '65px',
      right: '50px',
      top: '10px',
      bottom: '10px',
      padding: '10px',
    },
    timer: {
        position: 'fixed',
        display: 'flex',
        width: '90%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center'
    }
}

class TimerView extends React.Component {
    constructor() {
        super();
        this.state = {
            time_remaining: '25:00',
            started: false,
            stopped: true           
        }
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
    }

    startTimer = () => {
        console.log('started Timer');
    }

    stopTimer = () => {
        console.log('stopped Timer');
    }

    render = () => {
        if (!this.props.displayed) {
            return null;
        }

        return(
            <div style={ TIMER_STYLES.main }>
                <h3>Pomodoro Timer</h3>
                <div style={ TIMER_STYLES.timer }>
                    <p>Hello</p>
                </div> 
            </div>
        );
    }
}

export default TimerView;