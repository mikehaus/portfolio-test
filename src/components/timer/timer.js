import React from 'react';
import { Button, ButtonToolbar } from 'rsuite';

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
    timer_box: {
        position: 'absolute',
        display: 'flex',
        width: '40%',
        minWidth: 280,
        minHeight: 400,
        height: '50%',
        top: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2e2e2e',
        borderRadius: 10
    },
    time: {
        position: 'absolute',
        color: '#f5f5f5',
        top: '20%',
        fontSize: 58,
        alignItems: 'center'
    },
    buttons: {
        position: 'absolute',
        bottom: '20%',
        alignItems: 'center'
    }
}

class TimerView extends React.Component {
    constructor() {
        super();
        this.state = {
            minutes: 25,
            seconds: 0,
            breakCount: 0,
            started: false,
            stopped: true,
            currentTask: '',
            tasks: []
        };
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.setBreak = this.setBreak.bind(this);
    }

    startTimer = () => {
        console.log('started Timer');
        this.interval = setInterval(() => {
            const { seconds, 
                    minutes,
                    restCount } = this.state;

            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }

           if (seconds === 0) {
               if (minutes === 0) {
                    clearInterval(this.interval);
                    this.setBreak();
               } else {
                   this.setState(({ minutes }) => ({
                       minutes: minutes - 1,
                       seconds: 59
                   }));
               }
           }
        }, 1000);
    }

    stopTimer = () => {
        console.log('stopped Timer');
        clearInterval(this.interval);
    }

    resetTimer = () => {
        console.log('reset Timer');
        this.stopTimer();
        this.setState({ 
            minutes: 25,
            seconds: 0 });
    }

    setBreak = () => {
        const { minutes, seconds, breakCount } = this.state;

        this.setState({ breakCount: breakCount + 1 }, () => {
            if (breakCount >= 3) {
                this.setState({ 
                    minutes: 15,
                    seconds: 0,
                    breakCount: 0 });
            } else {
                this.setState({
                    minutes: 5,
                    seconds: 0 });
            }
        })
    }

    render = () => {
        if (!this.props.displayed) {
            return null;
        }

        const { minutes, seconds } = this.state;

        return(
            <div style={ TIMER_STYLES.main }>
                <h3>Pomodoro Timer</h3>
                <div style={ TIMER_STYLES.timer_box }>
                    <div style={ TIMER_STYLES.time }>
                        <p>{ minutes }:{ seconds < 10 ? `0${ seconds }` : seconds }</p>
                    </div>
                    <div style={ TIMER_STYLES.buttons }>
                        <ButtonToolbar>
                            <Button 
                                color='green'
                                size='lg'
                                onClick={ this.startTimer }>
                                Start
                            </Button>
                            <Button 
                                color='red'
                                size='lg'
                                onClick={ this.stopTimer }>
                                Stop
                            </Button>
                            <Button
                                appearance='ghost'
                                color='cyan'
                                size='lg'
                                onClick={ this.resetTimer }>
                                reset
                            </Button>
                            <Button
                                onClick={ this.setBreak } >
                                Test Break
                            </Button>
                        </ButtonToolbar>
                    </div>
                </div> 
            </div>
        );
    }
}

export default TimerView;