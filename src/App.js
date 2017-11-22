import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const HOC = (InnerComponent) => class extends Component {
    constructor() {
        super();
        this.state = {count: 0};
    }

    update() {
        this.setState({count: this.state.count + 1});
    }

    componentWillMount() {
        console.log('hoc');
    }

    render() {
        return (
            <InnerComponent {...this.props} {...this.state} update={this.update.bind(this)}/>
        )
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {txt: 'this is the state txt', a: '', b: '', val: 0, increasing: false, items: []};
        this.update = this.update.bind(this);
        this.filter = this.filter.bind(this);
    }

    filter(e) {
        this.setState({filter: e.target.value});
    }

    update(e) {
        this.setState({
            // txt: ReactDOM.findDOMNode(this.c).value,
            txt: this.c.refs.input.value,
            a: this.a.value,
            b: this.refs.b.value,
            val: this.state.val + 1
        });

        ReactDOM.render(<App value={this.props.value + 1}/>, document.getElementById('b'));
    }

    /**
     * 组件接收Props属性
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.value > this.props.value) {
            this.setState({increasing: true});
        }
    }

    /**
     *  组件是否升级（渲染）
     * @param nextProps
     * @param nextState
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.value % 5 === 0;
    }

    /**
     *  组件将要加载
     */
    componentWillMount() {
        console.log('componentWillMount');
        // this.setState({m: 2});
        fetch('https://swapi.co/api/people/?format=json')
            .then(response => response.json())
            .then(({results:items}) => {
                this.setState({items})
            });
    }

    render() {
        console.log('render');
        console.log(this.state.increasing);
        let items = this.state.items;

        if (this.state.filter) {
            items = items.filter(item => item.name.toLowerCase().includes(this.state.filter.toLowerCase()));
        }
        return (
            <div>
                {/*<input ref={node => this.a = node} type="text" onChange={this.update}/>{this.state.a} <br/>*/}
                {/*<input ref="b" type="text" onChange={this.update}/>{this.state.b}*/}
                <h1>{this.state.txt}</h1>
                <b>{this.props.cat}</b> <br/>
                <Widget ref={component => this.c = component} update={this.update}/> <br/>
                <Button text={2}>&hearts; React</Button> <br/>
                <LabelHOC>This is label</LabelHOC>
                <br/>
                <Parent>
                    <div className="childA"></div>
                    {/*<div className="childB"></div>*/}
                </Parent>
                <br/>
                {/*<button onClick={this.update}>{this.state.val * this.state.m}</button>*/}
                <button onClick={this.update}>{this.props.value}</button>
                <br/>
                {/*{items.map(item => <h4 key={item.name}>{item.name}</h4>)}*/}
                <input type="text" onChange={this.filter}/>
                {items.map(item => <Person key={item.name} person={item}/>)}
            </div>
        );
    }

    /**
     *  组件加载完毕
     */
    componentDidMount() {
        console.log('componentDidMount');
        console.log(ReactDOM.findDOMNode(this));
        // this.inc = setInterval(this.update, 500);
    }

    /**
     * 组件升级完毕
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate(prevProps, prevState) {
        console.log(`prevProps: ${prevProps.value}`);
    }

    /**
     * 组件卸载
     */
    componentWillUnmount() {
        console.log('componentWillUnmount');
        // clearInterval(this.inc);
    }
}

class Parent extends Component {
    render() {
        // let items = this.props.children.map(child => child);
        // let items = React.Children.map(this.props.children, child=>child);
        // let items = React.Children.toArray(this.props.children);
        // let items = React.Children.forEach(this.props.children, child => console.log(child.props.className));
        let items = React.Children.only(this.props.children);

        console.log(items);
        return null;
    }
}

class Label extends Component {
    constructor() {
        super();
        this.state = {message: 'hello'};
    }

    componentWillMount() {
        console.log('label');
    }

    render() {
        return (
            <label
                onMouseMove={this.props.update}>{this.props.children}--{this.props.count}--{this.state.message}</label>
        )
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
        ReactDOM.render(<App />, document.getElementById('b'));
    }

    unmount() {
        ReactDOM.unmountComponentAtNode(document.getElementById('b'));
    }

    render() {
        return (
            <div>
                <button onClick={this.mount.bind(this)}>Mount</button>
                <button onClick={this.unmount.bind(this)}>Unmount</button>
                <div id="b"></div>
            </div>
        )
    }
}

const Person = (props) => <h4>{props.person.name}</h4>;

// const Widget = (props) => {
//     return (
//         <input ref="input" type="text" onChange={props.update}/>
//     )
// }
const LabelHOC = HOC(Label);
const Button = HOC((props) => <button onClick={props.update}>{props.children}--{props.text}--{props.count}</button>);

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
    cat: 3,
    value: 0
}

export default Wrapper;
