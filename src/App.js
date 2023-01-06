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

			//Create the xScale and the yScale
			const [xScale, yScale] = [
				d3.scaleLinear().range([padding, w - padding]).domain([d3.min(dataset, (d)=>(d.Year - 1)), d3.max(dataset, (d)=>(d.Year+1))])
				,
			// d3.scaleLinear().range([h - padding, padding]).domain([d3.max(dataset, d=>(d.Seconds)), d3.min(dataset, d=>(d.Seconds))])
			d3.scaleTime().range([h - padding, padding]).domain([d3.max(dataset, d=>(new Date(0, 0, 0, 0, d.Time.split(':')[0] ,   d.Time.split(':')[1]))), d3.min(dataset, d=>(new Date(0, 0, 0, 0, d.Time.split(':')[0],   d.Time.split(':')[1])))]).nice()
			];

			//creating the xAxis and yAxis
			const [xAxis, yAxis] = [
				d3.axisBottom(xScale)
				.tickFormat(d3.format('d'))
				,
				 d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S')).ticks(d3.timeSecond.every(15))
				];
			svg.append("g").attr("id", "x-axis").attr("transform", `translate(0, ${h - padding})`).call(xAxis);
			svg.append("g").attr("id", "y-axis").attr("transform", `translate(${padding}, 0)`).call(yAxis);

			//Create the Shape
			const shape = svg.selectAll("circle").data(dataset).enter().append('circle').attr("r", 5).attr('cx', d=>(xScale(d.Year))).attr("cy", d=>(yScale(new Date(0, 0, 0, 0, d.Time.split(':')[0],   d.Time.split(':')[1])))).attr("class", "dot").attr("data-xvalue", d=>(d.Year)).attr("data-yvalue", d=>(new Date(0, 0, 0, 0, d.Time.split(':')[0],   d.Time.split(':')[1]))).style("fill", d=>((d.Doping === "")?('#f77f00'):('#219ebc')));

			//Create the tooltip
			shape.on('mouseenter', (i, d)=>{
				const [mouseY, mouseX] = [(yScale(new Date(0, 0, 0, 0, d.Time.split(':')[0],   d.Time.split(':')[1]))) - 30, xScale(d.Year) + 10];
			d3.select("svg").append("foreignObject").attr("width", 250).attr("height", 130).attr("x", mouseX).attr("y", mouseY).append("xhtml:div").attr("id", "tooltip").attr("data-year", d.Year).html(`<div class='name'>${d.Name}: ${d.Nationality}</div><div class='year-time'>Year:${d.Year}, Time:${d.Time}</div><br><div class='crime'>${d.Doping}</div>`);
			console.log("first event worked");
			console.log("me");
			console.log(d.Year);
			}).on('mouseout', ()=>{d3.select('#tooltip').remove()});

			//Create the legend
			let foreignObject = d3.select("svg").append("foreignObject").attr("width", 25).attr("height", 120).attr("y", "100").style("text-justify", "end");
			let foreignObject1 = d3.select("svg").append("foreignObject").attr("width", 170).attr("height", 50).attr("y", "300").attr("x", "800");

			let div = foreignObject1.append("xhtml:div").attr("id", "legend").html("<div class='narcots'><div class='dopeText'>No doping allegations </div><div id='undoped'></div></div><div class='narcots'><div class='dopeText'>Riders with doping allegations</div><div id='doped'></div></div>");
			let yLabel = foreignObject.append("xhtml:h4").text("Time in Minutes").attr("id", "yLabel");

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