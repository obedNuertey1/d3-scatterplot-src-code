import React, { startTransition } from 'react';
import './style.css';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import "bootstrap/dist/css/bootstrap.min.css";
import {Button, Card, Nav, Col, Row, Image} from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';
import thunk from 'redux-thunk';
import {PropTypes} from 'prop-types';
import * as d3 from 'd3';
import { timeMinute } from 'd3';
import { timeFormat } from 'd3-time-format';


//REACT-REDUX part1 ends

class Main extends React.Component{
	constructor(props){
		super(props);
		this.showSVG = this.showSVG.bind(this);
	}
	shouldComponentUpdate(nextState, nextProps){
		return true;
	}

	componentWillMount(){
		$('body').addClass('backgroundColor');
	}
	componentWillUnmount(){
		document.removeEventListener('DOMContentLoaded', this.showSVG());
	}
	componentDidMount(){
		document.addEventListener('DOMContentLoaded', this.showSVG());
	}

	showSVG(){

		//Get the data from the Giving API
		const req = new XMLHttpRequest();
		req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", true);
		req.send();

		req.onload = ()=>{
			const json = JSON.parse(req.responseText);
			const dataset = json;
			//Define the width height and padding of the svg canvas
			const [w, h, padding] = [1000, 515, 30];

			//Create the svg canvas
			const svg = d3.select("svg").attr("width", w).attr("height", h);

			//Create the xScale and the yScale
			const [xScale, yScale] = [
				d3.scaleLinear().range([padding, w - padding]).domain([d3.min(dataset, (d)=>(d.Year - 1)), d3.max(dataset, (d)=>(d.Year+1))])
				,
			 d3.scaleLinear().range([h - padding, padding]).domain(d3.extent(dataset, d=>(d.Seconds)))
			];

			//creating the xAxis and yAxis
			const [xAxis, yAxis] = [
				d3.axisBottom(xScale)
				.tickFormat(d3.format('d'))
				,
				 d3.axisLeft(yScale).tickFormat((d) => {
					const minutes = Math.floor(d / 60); // convert seconds to minutes
					const seconds = d % 60; // get the remaining seconds
					return d3.timeFormat('%M:%S')(new Date(0, 0, 0, 0, minutes, seconds)); // format as minutes:seconds
				}) .ticks(10)
				];

			svg.append("g").attr("transform", `translate(0, ${h - padding})`).call(xAxis);
			svg.append("g").attr("transform", `translate(${padding}, 0)`).call(yAxis);
		};

	}


	render(){
		return(
			<div className="wrapperContainer">
				<div className="mainContainer">
					<div className='title_subtitle'>
						<h1 id="title">Doping in Professional Bicycle Racing</h1>
						<h3>35 Fastest times up Alpe d'Huez</h3>
					</div>
					<svg></svg>
				</div>
			</div>
		);
	}
};

export default Main;
















import React, { startTransition } from 'react';
import './style.css';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import "bootstrap/dist/css/bootstrap.min.css";
import {Button, Card, Nav, Col, Row, Image} from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';
import thunk from 'redux-thunk';
import {PropTypes} from 'prop-types';
import * as d3 from 'd3';
import { timeMinute } from 'd3';
import { timeFormat } from 'd3-time-format';


//REACT-REDUX part1 ends

class Main extends React.Component{
	constructor(props){
		super(props);
		this.showSVG = this.showSVG.bind(this);
	}
	shouldComponentUpdate(nextState, nextProps){
		return true;
	}

	componentWillMount(){
		$('body').addClass('backgroundColor');
	}
	componentWillUnmount(){
		document.removeEventListener('DOMContentLoaded', this.showSVG());
	}
	componentDidMount(){
		document.addEventListener('DOMContentLoaded', this.showSVG());
	}

	showSVG(){

		//Get the data from the Giving API
		const req = new XMLHttpRequest();
		req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", true);
		req.send();

		req.onload = ()=>{
			const json = JSON.parse(req.responseText);
			const dataset = json;
			//Define the width height and padding of the svg canvas
			const [w, h, padding] = [1000, 515, 60];

			//Create the svg canvas
			const svg = d3.select("svg").attr("width", w).attr("height", h);

			const timeRegex = /[1-9][0-9]:[0-9][0-9]/ig;

			//Create the xScale and the yScale
			const [xScale, yScale] = [
				d3.scaleLinear().range([padding, w - padding]).domain([d3.min(dataset, (d)=>(d.Year - 1)), d3.max(dataset, (d)=>(d.Year+1))])
				,
			 d3.scaleTime().range([h - padding, padding]).domain(d3.extent(dataset, d=>(new Date(0, 0, 0, 0, d.Time.split(':')[0],   d.Time.split(':')[1])))).nice()
			];

			//creating the xAxis and yAxis
			const [xAxis, yAxis] = [
				d3.axisBottom(xScale)
				.tickFormat(d3.format('d'))
				,
				 d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S')).ticks(d3.timeSecond.every(15))
				];

			svg.append("g").attr("transform", `translate(0, ${h - padding})`).call(xAxis);
			svg.append("g").attr("transform", `translate(${padding}, 0)`).call(yAxis);

			//Create the shapes
			svg.selectAll('circle').data(dataset).enter().append('circle').attr("r", 5).attr("cx", d=>(xScale(d.Year))).attr("cy", d=>(yScale(new Date(0, 0, 0, 0, d.Time.split(':')[0],   d.Time.split(':')[1]))));
		};

	}


	render(){
		return(
			<div className="wrapperContainer">
				<div className="mainContainer">
					<div className='title_subtitle'>
						<h1 id="title">Doping in Professional Bicycle Racing</h1>
						<h3>35 Fastest times up Alpe d'Huez</h3>
					</div>
					<svg></svg>
				</div>
			</div>
		);
	}
};

export default Main;