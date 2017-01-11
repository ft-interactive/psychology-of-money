import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import throttle from 'lodash/throttle';
import d3 from 'd3';

class SpineChart extends Component {
  constructor(props) {
    super(props);
    // Calculate height at 16:9 aspect ratio
    const calculatedHeight = (this.props.initialWidth / 16) * 9;
    // Make sure height is never less than n
    const height = calculatedHeight < 125 ? 125 : calculatedHeight;

    this.state = {
      width: this.props.initialWidth,
      height,
      // Placeholder content displayed before chart render
      chart: 'Loading chart…',
    };
    this.redrawChart = this.redrawChart.bind(this);
    this.handleResize = this.handleResize.bind(this);

    for (const mixin in ReactFauxDOM.mixins.anim) { // eslint-disable-line
      if ({}.hasOwnProperty.call(ReactFauxDOM.mixins.anim, mixin)) {
        this[mixin] = ReactFauxDOM.mixins.anim[mixin].bind(this);
      }
    }

    for (const mixin in ReactFauxDOM.mixins.core) { // eslint-disable-line
      if ({}.hasOwnProperty.call(ReactFauxDOM.mixins.core, mixin)) {
        this[mixin] = ReactFauxDOM.mixins.core[mixin].bind(this);
      }
    }
  }

  componentDidMount() {
    // Create a faux SVG and store its virtual DOM in state.chart
    const chart = this.connectFauxDOM('svg', 'chart');
    // Get chart data off component props
    const data = this.props.data;
    // Run some D3 on the faux SVG
    const margin = { // Mike Bostock's margin convention
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    };
    const width = this.state.width - margin.left - margin.right;
    const height = this.state.height - margin.top - margin.bottom;
    const barHeight = Math.round(height / data.length) - 4;
    const x = d3.scale
        .linear()
        .domain([-100, 100])
        .range([margin.left, margin.left + width]);
    const y = d3.scale
        .ordinal()
        .domain(data.map(d => d.category))
        .rangePoints([margin.top, height], 1);
    const xAxis = d3.svg
        .axis()
        .scale(x)
        .orient('bottom')
        .ticks(5)
        .tickFormat(d => `${d}%`);
    const yAxis = d3.svg
        .axis()
        .scale(y)
        .orient('left')
        .tickSize(0)
        .tickFormat((d, i) => {
          const text = [
            'Anxious Investor',
            'Cash Splasher',
            'Fitbit Financier',
            'Hoarder',
            'Ostrich',
            'Social Value Spender',
          ];

          return text[i];
        });
    const svg = d3.select(chart)
        .attr('width', width + margin.left + margin.right)
        .attr('height', 0)
        .attr('class', 'column-chart');
    const bar = svg.selectAll('.bar')
        .data(data)
      .enter().append('g')
        .filter(d => (d.value !== 0 && !isNaN(d.value)))
        .attr('class', 'bar')
        .attr('transform', `translate(0, -${barHeight / 2})`);
    const rect = bar.append('rect')
        .attr('x', x(0))
        .attr('y', d => y(d.category))
        .attr('width', 0)
        .attr('height', barHeight)
        .attr('class', d => {
          if (d.value >= 0) {
            return 'diverging-r';
          }

          return 'diverging-l';
        });

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(${margin.left + (width / 2)}, 0)`)
        .call(yAxis)
      .selectAll('.tick text')
        .attr('x', (width / 2) * -1)
        .style('text-anchor', 'end')
        .attr('transform', 'translate(145, 0)');

    svg.select('.y')
      .append('text')
        .attr('class', 'y axis label')
        .attr('x', width / 2)
        .attr('y', margin.top)
        .style('text-anchor', 'end')
        .text('Your rating (per cent)');

    // Set up on-render transitions
    svg.transition()
        .duration(500)
        .attr('height', height + margin.top + margin.bottom);
    rect.transition()
        .ease('elastic')
        .delay((d, i) => 500 + (i * 7.5))
        .duration(500)
        .attr('x', d => {
          if (d.value > 0) return x(0);

          return x(0) - Math.abs(x(0) - x((d.value / 18) * 100));
        })
        .attr('width', d => Math.abs(x(0) - x((d.value / 18) * 100)));

    // Kick off transitions
    this.animateFauxDOM(2000);

    // Add window resize event listener
    window.addEventListener('resize', throttle(this.handleResize, 750));
  }

  redrawChart() {
    // Access the SVG virtual DOM
    const chart = this.connectedFauxDOM.chart;
    // Access the data
    const data = this.props.data;
    // Redraw the chart
    const margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    };
    const width = this.state.width - margin.left - margin.right;
    const height = this.state.height - margin.top - margin.bottom;
    const barHeight = Math.round(height / data.length) - 4;
    const x = d3.scale
        .linear()
        .domain([-100, 100])
        .range([margin.left, margin.left + width]);
    const y = d3.scale
        .ordinal()
        .domain(data.map(d => d.category))
        .rangePoints([margin.top, height], 1);
    const xAxis = d3.svg
        .axis()
        .scale(x)
        .orient('bottom')
        .ticks(5)
        .tickFormat(d => `${d}%`);
    const yAxis = d3.svg
        .axis()
        .scale(y)
        .orient('left')
        .tickSize(0)
        .tickFormat((d, i) => {
          const text = [
            'Anxious Investor',
            'Cash Splasher',
            'Fitbit Financier',
            'Hoarder',
            'Ostrich',
            'Social Value Spender',
          ];

          return text[i];
        });
    // Update chart width and drill down to update x axis
    const svg = d3.select(chart)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    svg.select('.x')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    // Come back up to update y axis
    svg.select('.y')
        .attr('transform', `translate(${margin.left + (width / 2)}, 0)`)
        .call(yAxis)
      .selectAll('.tick text')
        .attr('x', (width / 2) * -1)
        .style('text-anchor', 'end')
        .attr('transform', 'translate(145, 0)');

    svg.select('.y.axis.label')
        .attr('x', width / 2)
        .attr('y', margin.top)
        .style('text-anchor', 'end');

    // Come back up again to update bars
    svg.selectAll('.bar')
        .attr('transform', `translate(0, -${barHeight / 2})`)
      .select('rect')
        .attr('x', d => {
          if (d.value > 0) return x(0);

          return x(0) - Math.abs(x(0) - x((d.value / 18) * 100));
        })
        .attr('y', d => y(d.category))
        .attr('width', d => Math.abs(x(0) - x((d.value / 18) * 100)))
        .attr('height', barHeight);

    this.drawFauxDOM();
  }

  handleResize() {
    // Repeat height calculation with fallback value as above
    const calculatedHeight = (this.node.offsetWidth / 16) * 9;
    const height = calculatedHeight < 125 ? 125 : calculatedHeight;

    this.setState({
      width: this.node.offsetWidth,
      height,
    });

    this.redrawChart();
  }

  render() {
    return (
      <div
        ref={node => { this.node = node; }}
        className="output-chart-container"
      >
        {this.state.chart}
      </div>
    );
  }
}

SpineChart.propTypes = {
  data: React.PropTypes.array,
  initialWidth: React.PropTypes.number,
  inputMin: React.PropTypes.number,
  inputMax: React.PropTypes.number,
  userAnswer: React.PropTypes.string,
};

export default SpineChart;
