var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers');

/*
	App
*/

var App = React.createClass({

	render : function() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="FRESH SEAFOOD MARKET" />
				</div>
				<Order/>
				<Inventory />
			</div>
		)
	}
});


/*
	Add Fish Form
	<AddFishForm />
*/

var AddFishForm = React.createClass({
	render : function() {
		return (
			<p>Testing this is the fish form</p>
		)
	}
})


/*
	Header
*/

var Header = React.createClass({
	render : function() {
		return (
			<header className="top">
				<h1>Catch
					<span className="ofThe">
						<span className="of">of</span>
						<span className="the">the</span>
					</span>
					Day</h1>
				<h3 className="tagline"><span>{this.props.tagline}</span></h3>
			</header>
		)
	}
})


/*
	Order
*/

var Order = React.createClass({
	render : function() {
		return (
			<p>Order</p>
		)
	}
})


/*
	Inventory  
*/

var Inventory = React.createClass({
	render : function() {
		return (
			<div>
				<h2>Inventory</h2>

				<AddFishForm />
			</div>
		)
	}
})


/* 
	StorePick
	This will let us make <StorePicker/>
*/

var StorePicker = React.createClass({
	mixins : [History],
	goToStore : function(event) {
		event.preventDefault();
		// get the data from the input
		var storeId = this.refs.storeId.value;
		this.history.pushState(null, '/store/' + storeId);
	},
	render: function() {
		var name = "John";
		return (
			<form className="store-selector" onSubmit={this.goToStore}>
				<h2>Please Enter A Store {name}</h2>
				<input type="text" ref="storeId" defaultValue={h.getFunName()} required />
				<input type="Submit" />
			</form>
		)
	}

});


/*
	Not Found
*/

var NotFound = React.createClass({
	render : function() {
		return <h1>Not Found!</h1>
	}
});


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
