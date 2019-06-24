import 'd3-transition'
// import {Motion, spring} from 'react-motion'
import styles from '../Visualizations/TimeLine/TimeLine.css'
import React, {Component} from 'react'
import {select as d3Select} from 'd3-selection'

// Import the D3 libraries we'll be using for the spark line.
/*
import {extent as d3ArrayExtent} from 'd3-array'
import {
  scaleLinear as d3ScaleLinear,
  scaleTime as d3ScaleTime
} from 'd3-scale' */
import {curveBasis as d3CurveBasis,
  line as d3Line} from 'd3-shape'

class MissingData extends Component {
  constructor (props) {
    super(props)
    this.state = {
      missingDataPoints: this.props.missingDataPoints,
      width: this.props.width,
      height: this.props.height,
      visType: this.props.visType,
      oldProps: {}
    }
    this.createSketchyData = this.createSketchyData.bind(this)
    this.createSketchyLine = this.createSketchyLine.bind(this)
  }

  // makes sure to not rerender if values did not change
  shouldComponentUpdate (nextProps) {
    if (JSON.stringify(this.props) === JSON.stringify(nextProps)) {
      return false
    } else {
      this.setState({oldProps: nextProps})
      return true
    }
  }

  componentDidMount () {
    this.createChart()
  }

  componentDidUpdate () {
    this.createChart()
  }
 
  createChart () {
    const node = this.node
    let lines = []

    // deletes the last version
    d3Select('.missingData')
      .remove()

    d3Select(node)
      .append('g')
      .attr('class', 'missingData')

    switch (this.props.visType) {
      case 'sketchiness': {
        this.props.missingDataPoints.forEach(element => {
          lines.push(this.createSketchyData(element, this.createSketchyLine))
        })

        // line factory for the sketchy points
        const lineFactory = d3Line()
          .curve(d3CurveBasis)

        lines.forEach(line => {
          let color = line[line.length - 1]
          d3Select('.missingData')
            .append('g')
            .attr('class', color)
            .attr('key', JSON.stringify(line))
            // .attr('className', styles.line)
            .append('path')
            .style('stroke', color)
            .style('opacity', 0.8)
            .attr('d', lineFactory(line.slice(0, (line.length - 1))))
        })
        break
      }
      case 'dashing': {
        this.props.missingDataPoints.forEach(element => {
          lines.push(this.createSketchyData(element))
        })
        // Create a d3Line factory for our scales.
        const lineFactory = d3Line()

        lines.forEach(line => {
          let color = line[line.length - 1]
          d3Select('.missingData')
            .append('g')
            .attr('key', JSON.stringify(line))
            .attr('className', styles.line)
            .append('path')
            .style('stroke', color)
            .style('opacity', 0.8)
            .style('stroke-dasharray', (5, 5))
            .attr('d', lineFactory(line.slice(0, (line.length - 1))))
        })
        break
      }
      case 'blur': {
        this.props.missingDataPoints.forEach(element => {
          lines.push(this.createSketchyData(element))
        })
        // Create a d3Line factory for our scales.
        const lineFactory = d3Line()

        lines.forEach(line => {
          let color = line[line.length - 1]
          d3Select('.missingData')
            .append('g')
            .attr('key', JSON.stringify(line))
            .attr('className', styles.line)
            .append('path')
            .style('stroke', color)
            .style('opacity', 0.8)
            .attr('d', lineFactory(line.slice(0, (line.length - 1))))
        })      
        break
      }
    }
  }

  createSketchyData (data, func) {
    // if missing data is at the end or beginning of the line
    if (data.length < 2) {
      if (data[0].state === 'end') {
        return func ? (func(0, data[0].x, data[0].y, data[0].y, data[0].year - 1996).concat(data[0].color)) : [[0, data[0].y], [data[0].x, data[0].y], data[0].color]
      } else {
        return func ? (func(data[0].x, this.props.width, data[0].y, data[0].y, 2019 - data[0].year).concat(data[0].color)) : [[data[0].x, data[0].y], [this.props.width, data[0].y], data[0].color]   
      }
    } else {
      return func ? (func(data[0].x, data[1].x, data[0].y, data[1].y, data[1].year - data[0].year).concat(data[0].color)) : [[data[0].x, data[0].y], [data[1].x, data[1].y], data[0].color]
    }
  }

  // create the points needed for a sketchy line
  // needs start- and end-coordinates and a start- and end-value for 
  // how sketchy the points are (between 0, unsketchy and 1, sketchy)
  createSketchyLine (x0, x1, y0, y1, l) {
    const dmax = 4 // maximum squiggle, fixed by AlMeraj to 5
    let tf = 2 // time to draw line, fixed by AlMeraj to 2
    const dt = 0.25 // interval of squiggles, fixed by AlMeraj to 0.5 for lines up to 200px
    let points = []

    // add the first point which is the same as the original
    points.push([x0, y0])

    const m = (y1 - y0) / (x1 - x0)
    const b = y0 - m * x0
    let iPoints = [[x0, y0]]

    // the line needs to be cut into several intermediate lines
    // this is to give the line a pleasant and even squiggle
    for (let x = x0 + ((x0 + x1) / l); x < x1; x += ((x0 + x1) / l)) {
      iPoints.push([x, m * x + b])
    }
    iPoints.push([x1, y1])

    for (let i = 0; i < iPoints.length - 1; i++) {
    // add all the intermediate points for the squiggle
      for (let t = dt; t < tf; t += dt) {
        const tau = t / tf
        let s = 1
  
        let d = this.getRandomD(dmax, s)
        let x = iPoints[i][0] + (iPoints[i][0] - iPoints[i + 1][0]) * (15 * Math.pow(tau, 4) - 6 * Math.pow(tau, 5) - 10 * Math.pow(tau, 3)) + d
  
        // check if the random values are too big or small
        // to stop the lines from going over the actual point
        if (x > iPoints[i + 1][0]) {
          x = iPoints[i + 1][0] 
        } else if (x < iPoints[i][0]) {
          x = iPoints[i][0]
        }
  
        d = this.getRandomD(dmax, s)
        const y = iPoints[i][1] + (iPoints[i][1] - iPoints[i + 1][1]) * (15 * Math.pow(tau, 4) - 6 * Math.pow(tau, 5) - 10 * Math.pow(tau, 3)) + d

        points.push([x, y])
      }
    }
    // to add the last point which will be the same as the original
    points.push([x1, y1])
    return points
  }

  // help function for getting a random value between -dmax and +dmax with
  // intensity s
  getRandomD (dmax, s) {
    return Math.floor(Math.random() * ((dmax * s * 2) + 1)) - (dmax * s)
  } 

  render () {
    return (<svg ref={node => (this.node = node)}></svg>) 
  }
}

export default MissingData
