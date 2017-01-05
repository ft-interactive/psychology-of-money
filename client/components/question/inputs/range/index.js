import React, { Component } from 'react';
import _ from 'lodash';

class Range extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      rangeDisabled: false,
      submitDisabled: false,
      incrementWidth: null,
      // diffFactor is the difference between the thumb width and the range overlay width expressed
      // as an incremental factor (needed for correct overlay positioning)
      diffFactor: null,
      center: null,
      rangeOverlayPosition: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.handleResize();

    window.addEventListener('resize', _.throttle(this.handleResize, 500));
  }

  handleChange(value) {
    const inputValue = parseInt(value, 10);
    const num = isNaN(inputValue) ? 0 : inputValue; // Ensure input value is a number
    const incrementWidth = this.state.incrementWidth;
    const diffFactor = this.state.diffFactor;
    const center = this.state.center;
    const rangeOverlayPosition = center + (num * incrementWidth) + (num * diffFactor);

    this.setState({
      value: num,
      // submitDisabled: false,
      rangeOverlayPosition,
    });
  }

  handleResize() {
    const num = this.state.value;
    const width = this.rangeInput.offsetWidth - 40;
    const incrementWidth = width / (this.props.increments - 1);
    const diffFactor = (this.props.overlayWidth - this.props.thumbWidth) /
      (this.props.increments - 1);
    const center = (width / 2);
    const rangeOverlayPosition = center + (num * incrementWidth) + (num * diffFactor);

    this.setState({
      width,
      incrementWidth,
      diffFactor,
      center,
      rangeOverlayPosition,
    });
  }

  render() {
    return (
      <div className="input">
        <link
          rel="stylesheet"
          href="//origami-build.ft.com/v2/bundles/css?modules=o-icons@^5.0.0"
        />

        <form
          onSubmit={event => {
            this.setState({
              rangeDisabled: true,
              submitDisabled: true,
            });
            this.props.onSubmit(event, this.state.value);
            // TODO: comment out the lines below if you don't want the things to fade out
            // this.submitButton.style.opacity = 0;
            // this.rangeInput.classList.add('hidden');
            // this.rangeLabels.classList.add('hidden');
            // this.output.classList.add('hidden');
          }}
          className="range-input"
        >
          {/* <div
            className="range-labels"
            ref={node => { this.rangeLabels = node; }}
          >

          </div> */}

          <div className="range-container">
            <div className="range-labels range-labels-min">
              <span>{this.props.min}</span>
            </div>

            <div
              className="range-slider"
            >
              <input
                type="range"
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                value={this.state.value}
                onChange={event => this.handleChange(event.target.value)}
                disabled={this.state.rangeDisabled}
                ref={node => { this.rangeInput = node; }}
              />

              <output
                style={{ left: `${this.state.rangeOverlayPosition}px` }}
                ref={node => { this.output = node; }}
              >
                {this.state.value > 0 ? `+${this.state.value}` : this.state.value}
              </output>
            </div>

            <div className="range-labels range-labels-max">
              <span>+{this.props.max}</span>
            </div>
          </div>

          <div className="sub-labels-container">
            <div className="sub-labels sub-labels-l">
              <i className="icon-arrow-left" />
              <span>Strongly disagree</span>
            </div>
            <div className="sub-labels sub-labels-c">
              <span>Neutral/not sure</span>
            </div>
            <div className="sub-labels sub-labels-r">
              <span>Strongly agree</span>
              <i className="icon-arrow-right" />
            </div>
          </div>

          <input
            type="submit"
            value="SUBMIT ANSWER"
            disabled={this.state.submitDisabled}
            className="o-buttons o-buttons--big o-buttons--standout"
            ref={node => { this.submitButton = node; }}
          />
        </form>

        {/* TODO: Spacer div may be required if using in combination with a chart output */}
        {/* <div className="spacer" /> */}
      </div>
    );
  }
}

Range.propTypes = {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  increments: React.PropTypes.number,
  step: React.PropTypes.number,
  thumbWidth: React.PropTypes.number,
  overlayWidth: React.PropTypes.number,
  onSubmit: React.PropTypes.func,
};

export default Range;
