import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class App extends Component {
    constructor() {
        super();
        this.state = {
            txt: 'this is the state txt',
            a: '',
            b: '',
            val: 0
        }
    }

    update(e) {
        this.setState({
            // txt: ReactDOM.findDOMNode(this.c).value,
            txt: this.c.refs.input.value,
            a: this.a.value,
            b: this.refs.b.value,
            val: this.state.val + 1
        });
    }

    componentWillMount() {
        console.log('componentWillMount');
    }

    componentDidMount() {
        console.log('componentDidMount');
    }

    render() {
        console.log('render');
        return (
            <div>
                <input ref={node => this.a = node} type="text" onChange={this.update.bind(this)}/>{this.state.a} <br/>
                <input ref="b" type="text" onChange={this.update.bind(this)}/>{this.state.b}
                <h1>{this.state.txt}</h1>
                <b>{this.props.cat}</b> <br/>
                <Widget ref={component => this.c = component} update={this.update.bind(this)}/> <br/>
                <Button text={2}>&hearts; React</Button> <br/>
                <button onClick={this.update.bind(this)}>{this.state.val}</button>
            </div>
        );
    }

    componentWillUnmount() {
        console.log('componentWillUnmount');
    }
}

class Widget extends Component {
    render() {
        return (
            <input ref="input" type="text" onChange={this.props.update}/>
        )
    }
}

class Wrapper extends Component {
    mount() {
        ReactDOM.render(<App />, document.getElementById('a'));
    }

    unmount() {
        ReactDOM.unmountComponentAtNode(document.getElementById('a'));
    }

    render() {
        return (
            <div>
                <button onClick={this.mount.bind(this)}>Mount</button>
                <button onClick={this.unmount.bind(this)}>Unmount</button>
                <div id="a"></div>
            </div>
        )
    }
}

// const Widget = (props) => {
//     return (
//         <input ref="input" type="text" onChange={props.update}/>
//     )
// }

const Button = (props) => {
    return <button>{props.children}--{props.text}</button>
}

Button.propTypes = {
    text(props, propName, component){
        if (!(propName in props)) {
            return new Error(`missing ${propName}`);
        } else {
            if (typeof props[propName] !== 'number') {
                return new Error(`${propName} must be number`);
            }
        }
    }
}

App.propTypes = {
    txt: PropTypes.string,
    cat: PropTypes.number.isRequired
}

App.defaultProps = {
    txt: 'Hello World!',
    cat: 3
}

export default Wrapper;
