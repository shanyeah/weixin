import React from 'react';
import Loading from 'react-loading-components';
import './LoadingView.css'

class LoadingView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div className='loading_div'>
            {this.props.loading ? <Loading type='puff' width={60} height={60} fill='#4A90E2' /> : <div></div>}
        </div>);
    }
}

export default LoadingView;
