var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers');

// Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://catch-of-the-day-jpb.firebaseio.com/');

var Catalyst = require('react-catalyst');

/*
	Import Components
*/

import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';
import Fish from './components/Fish';
import AddFishForm from './components/AddFishForm';
import Header from './components/Header';
import Order from './components/Order';


/*
	App
*/

var App = React.createClass({
	mixins: [Catalyst.LinkedStateMixin],
	getInitialState : function() {
		return {
			fishes : {},
			order : {}
		}
	},
	componentDidMount : function() {
		base.syncState(this.props.params.storeId + '/fishes', {
			context : this,
			state : 'fishes'
		});

		var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);

		if(localStorageRef) {
			// update our component state to reflect what is in local Storage
			this.setState({
				order : JSON.parse(localStorageRef)
			});
		}

	},
	componentWillUpdate : function(nextProps, nextState) {
		localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
	},
	addToOrder : function(key) {
		this.state.order[key] = this.state.order[key] + 1 || 1;
		this.setState({ order : this.state.order });
	},
	removeFromOrder : function(key) {
		delete this.state.order[key];
		this.setState({
			order : this.state.order
		});
	},
	addFish : function(fish) {
		var timestamp = (new Date()).getTime();
		// update the state object
		this.state.fishes['fish-' + timestamp] = fish;
		// set the state
		this.setState({ fishes : this.state.fishes });
	},
	removeFish : function(key) {
		if(confirm("Are you sure you want to remove this fish?")) {
			this.state.fishes[key] = null;
			this.setState({
				fishes : this.state.fishes
			});
		}
	},
	loadSamples : function() {
		this.setState({
			fishes : require('./sample-fishes')
		});
	},
	renderFish : function(key) {
		return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
	},
	render : function() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="3000" />
					<ul className="list-of-fishes">
						{Object.keys(this.state.fishes).map(this.renderFish)}
					</ul>
				</div>
				<Order fishes={this.state.fishes} order={this.state.order} linkState={this.linkState} removeFromOrder={this.removeFromOrder} />
				<Inventory addFish={this.addFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState} removeFish={this.removeFish} />
			</div>
		)
	}
});


/*
	Inventory  
*/

var Inventory = React.createClass({
	renderInventory : function(key) {
		var linkState = this.props.linkState;
		return (
			<div className="fish-edit" key={key}>
				<input type="text" valueLink={linkState('fishes.' + key + '.name')}/>
				<input type="text" valueLink={linkState('fishes.' + key + '.price')}/>
				<select valueLink={linkState('fishes.' + key + '.status')}>
					<option value="unavailable">Sold Out!</option>
					<option value="available">Fresh!</option>
				</select>

				<textarea valueLink={linkState('fishes.' + key + '.desc')}></textarea>
				<input type="text" valueLink={linkState('fishes.' + key + '.image')} />
				<button onClick={this.props.removeFish.bind(null, key)}>Remove Fish!</button>
			</div>
		)
	},
	render : function() {
		return (
			<div>
				<h2>Inventory</h2>

				{Object.keys(this.props.fishes).map(this.renderInventory)}

				<AddFishForm {...this.props} />
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		)
	},
	propTypes : {
		addFish : React.PropTypes.func.isRequired,
		loadSamples : React.PropTypes.func.isRequired,
		fishes : React.PropTypes.object.isRequired,
		linkState : React.PropTypes.func.isRequired,
		removeFish : React.PropTypes.func.isRequired
	}
})


/*
	Routes
*/

var routes = (
	<Router history={createBrowserHistory()}>
		<Route path="/" component={StorePicker}/>
		<Route path="/store/:storeId" component={App}/>
		<Route path="*" component={NotFound}/>
	</Router>
)
ReactDOM.render(routes, document.querySelector('#main'));
