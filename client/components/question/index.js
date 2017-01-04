import React, { Component } from 'react';
import Range from './inputs/range';

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answered: false,
      // correct: false,
      value: null,
    };
    this.markQuestion = this.markQuestion.bind(this);
  }

  markQuestion(event, value) {
    // Check if user answered correctly
    // const correct = value === this.props.answer;

    // Points awarded for this question (use for weighting etc.)
    const points = value;

    if (event) {
      event.preventDefault();
    }

    this.setState({
      answered: true,
      value: points,
    });

    // if (correct) {
    //   this.setState({ correct });
    //   this.props.updateScore(questionValue);
    // }

    this.props.updateScore(this.props.scoreCategory, points);
    this.props.updateProgress(this.props.questionIndex + 1);

    // POST response to server
    // fetch(`${this.props.endpoint}/response/`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     value,
    //     submitted: Date.now(),
    //     questionId: this.props.questionId,
    //     meta: {
    //       Country: this.props.country,
    //     },
    //   }),
    // }).then(res => console.log(res)).catch(e => console.error(e));
  }

  render() {
    const rangeMin = this.props.options[0];
    const rangeMax = this.props.options[1];
    const activeClass = this.props.active ? ' active' : '';
    const answeredClass = this.state.answered ? ' answered' : '';
    const input = (
      <Range
        min={rangeMin}
        max={rangeMax}
        increments={7}
        step={1}
        thumbWidth={28} // Must match the WebKit thumb width in ./inputs/range/_main.scss
        overlayWidth={40} // Must match the overlay width in ./inputs/range/_main.scss
        onSubmit={this.markQuestion}
      />
    );
    // const chart = this.state.answered && (
    //   <ColumnChart
    //     data={this.props.responsesData}
    //     initialWidth={this.node.offsetWidth}
    //     inputMin={rangeMin}
    //     inputMax={rangeMax}
    //     userAnswer={this.state.value}
    //     actualAnswer={this.props.answer}
    //     countryAnswer={this.props.countryAnswer}
    //   />
    // );
    // const output = this.state.answered && (
    //   <div className="o-grid-container">
    //     <div className="o-grid-row">
    //       <p>You answered {this.state.value}</p>
    //     </div>
    //   </div>
    // );

    return (
      <div
        className={`question${activeClass}${answeredClass}`}
        id={`${this.props.questionId}`}
        ref={node => { this.node = node; }}
      >
        <h2 className="o-typography-subhead--crosshead">
          {this.props.questionIndex + 1}.
        </h2>

        <p className="o-typography-lead--small">
          {this.props.questionText}
        </p>

        {input}

        {/* TODO: comment out the line below if you don't want a chart output */}
        {/* {chart} */}

        {/* TODO: comment out the line below if you don't want any other per-question output */}
        {/* {output} */}
      </div>
    );
  }
}

Question.propTypes = {
  questionId: React.PropTypes.string,
  questionIndex: React.PropTypes.number,
  active: React.PropTypes.bool,
  questionType: React.PropTypes.string,
  questionText: React.PropTypes.string,
  options: React.PropTypes.array,
  scoreCategory: React.PropTypes.string,
  // answer: React.PropTypes.any,
  // responsesData: React.PropTypes.object,
  updateProgress: React.PropTypes.func,
  updateScore: React.PropTypes.func,
  // endpoint: React.PropTypes.string,
};

export default Question;
