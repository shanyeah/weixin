import React from 'react';  
import './BaseTitleView.css'

class BaseTitleView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div className='base_title'>
            {this.props.title}
        </div>);
    }
}

export default BaseTitleView;