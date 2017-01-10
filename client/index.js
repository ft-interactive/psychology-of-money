import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';
import _ from 'lodash';
import Question from './components/question';

require('smoothscroll-polyfill').polyfill();

class App extends Component {
  constructor(props) {
    super(props);

    const { questions } = props; // eslint-disable-line

    this.state = {
      // TODO: set chooseQuestions to true if you want the question set to be
      // selectable on page load
      chooseQuestions: false,
      questions: [],
      types: [],
      questionsLoaded: false,
      activeQuestion: 0,
      score: [
        { category: 'fitbit', value: 0 },
        { category: 'anxious', value: 0 },
        { category: 'social', value: 0 },
        { category: 'cash', value: 0 },
        { category: 'hoarder', value: 0 },
        { category: 'ostrich', value: 0 },
      ],
      complete: false,
      tie: false,
      result: null,
    };
    this.setQuestions = this.setQuestions.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.scrollToNext = this.scrollToNext.bind(this);
    this.updateScore = this.updateScore.bind(this);
    this.calculateResult = this.calculateResult.bind(this);
    this.showTypeCopy = this.showTypeCopy.bind(this);
  }

  componentDidMount() {
    this.setQuestions();
  }

  setQuestions() {
    const questions = JSON.parse(document.getElementById('questions-data').textContent);
    const types = JSON.parse(document.getElementById('types-data').textContent);

    this.setState({
      questions,
      types,
      questionsLoaded: true,
    });
  }

  updateProgress(num) {
    if (num < this.state.questions.length) {
      this.setState({ activeQuestion: num });

      this.scrollToNext();
    } else {
      this.setState({
        activeQuestion: null,
        complete: true,
      });

      setTimeout(() => {
        this.calculateResult();
      }, 1000);
    }
  }

  scrollToNext() {
    const nextQuestion = this.state.activeQuestion + 1;

    document.getElementById(`q${nextQuestion}`)
      .scrollIntoView({ behavior: 'smooth' });
  }

  updateScore(category, value) {
    const prevScore = this.state.score;
    const categoryLookup = [
      'fitbit',
      'anxious',
      'social',
      'cash',
      'hoarder',
      'ostrich',
    ];
    const categoryIndex = categoryLookup.indexOf(category);
    const updatedScore = update(prevScore, {
      [categoryIndex]: { value: { $apply: prevValue => prevValue + value } },
    });

    this.setState({
      score: updatedScore,
    });
  }

  calculateResult() {
    const score = this.state.score;
    const scoreSorted = _.sortBy(score, ['value']);

    if (scoreSorted[5].value === scoreSorted[4].value) {
      this.setState({
        tie: true,
      });
    } else {
      this.setState({
        result: scoreSorted[5].category,
      });
    }

    console.log(scoreSorted);
    console.log(this.state.types);
  }

  showTypeCopy(event, type) {
    const a = document.getElementById(`${type}-show`);

    event.preventDefault();

    document.getElementById(`${type}-copy`).classList.toggle('unhide');

    if (a.innerHTML === 'Read more »') {
      a.innerHTML = '« Read less';
    } else {
      a.innerHTML = 'Read more »';
    }
  }

  render() {
    // const chooseQuestions = this.state.chooseQuestions && (
    //   <Overlay setQuestions={this.setQuestions} />
    // );
    const loadStatus = !this.state.questionsLoaded && <p><strong>Loading quiz…</strong></p>;
    const questions = this.state.questions
      .map((question, i) =>
        <Question
          key={question.meta.qid}
          questionIndex={i}
          active={i === this.state.activeQuestion}
          questionType={question.meta.type}
          questionText={question.text}
          options={Object.keys(question.options)
            .map(option => question.options[option])
            .filter(option => option !== null)}
          scoreCategory={question.meta.scorecategory}
          // responsesData={question.responses}
          updateProgress={this.updateProgress}
          updateScore={this.updateScore}
        />
      );
    const complete = this.state.complete;
    let userTypeHeading = null;
    let userTypeSubhead = null;
    let userTypeCopy = null;
    let results = null;

    switch (true) {
      case this.state.result === 'anxious':
        userTypeHeading = this.state.types[0].heading;
        userTypeSubhead = this.state.types[0].subhead;
        userTypeCopy = this.state.types[0].copy;
        break;
      case this.state.result === 'hoarder':
        userTypeHeading = this.state.types[1].heading;
        userTypeSubhead = this.state.types[1].subhead;
        userTypeCopy = this.state.types[1].copy;
        break;
      case this.state.result === 'social':
        userTypeHeading = this.state.types[2].heading;
        userTypeSubhead = this.state.types[2].subhead;
        userTypeCopy = this.state.types[2].copy;
        break;
      case this.state.result === 'cash':
        userTypeHeading = this.state.types[3].heading;
        userTypeSubhead = this.state.types[3].subhead;
        userTypeCopy = this.state.types[3].copy;
        break;
      case this.state.result === 'ostrich':
        userTypeHeading = this.state.types[4].heading;
        userTypeSubhead = this.state.types[4].subhead;
        userTypeCopy = this.state.types[4].copy;
        break;
      case this.state.result === 'fitbit':
        userTypeHeading = this.state.types[5].heading;
        userTypeSubhead = this.state.types[5].subhead;
        userTypeCopy = this.state.types[5].copy;
        break;
      default:
        userTypeHeading = 'calculating…';
    }

    if (complete) {
      results = (
        <div className="results">
          {!this.state.tie &&
            <div>
              <h2>Your financial personality type: {userTypeHeading}</h2>

              <p>{userTypeSubhead}</p>

              <div dangerouslySetInnerHTML={{ __html: userTypeCopy }} />
            </div>
          }

          {this.state.tie &&
            <div>
              <h2>Your financial personality type: inconclusive</h2>

              <p>Check the chart below to see how you rated against each of the
                different financial personality types.</p>
            </div>
          }

          <p>TKTK chart TKTK</p>

          {!this.state.tie && this.state.result &&
            <div>
              {this.state.types
                .filter(type => type.typename !== this.state.result)
                .map((type, i) =>
                  <div key={`type${i}`}>
                    <h2>{type.heading}</h2>

                    <p>
                      <span className="o-typography-lead">{type.subhead}</span>
                    </p>

                    <div
                      className="type-copy"
                      id={`${type.typename}-copy`}
                      dangerouslySetInnerHTML={{ __html: type.copy }}
                    />

                    <a
                      href={undefined}
                      onClick={event => this.showTypeCopy(event, type.typename)}
                      id={`${type.typename}-show`}
                    >
                      Read more »
                    </a>
                  </div>
                )
              }

              <a
                href={`https://twitter.com/intent/tweet?text=How%20well%20do%20you%20really%20know%20your%20country%3F%20My%20${this.state.country}%20rating%20was%20${Math.round(this.state.score)}%25%3B%20see%20how%20you%20compare%3A&url=https%3A%2F%2Fig.ft.com%2Fsites%2Fquiz%2Fperils-of-perception%2F2016%2F&via=FT`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="o-buttons o-buttons--big o-buttons--standout">
                  Tweet Your Result
                </button>
              </a>
            </div>
          }

          {this.state.tie &&
            <div>
              {this.state.types
                .map((type, i) =>
                  <div key={`type${i}`}>
                    <h2>{type.heading}</h2>

                    <p>
                      <span className="o-typography-lead">{type.subhead}</span>
                    </p>

                    <div
                      className="type-copy"
                      id={`${type.typename}-copy`}
                      dangerouslySetInnerHTML={{ __html: type.copy }}
                    />

                    <a
                      href={undefined}
                      onClick={event => this.showTypeCopy(event, type.typename)}
                      id={`${type.typename}-show`}
                    >
                      Read more »
                    </a>
                  </div>
                )
              }
            </div>
          }
        </div>
      );
    } else {
      results = (
        <div className="results">
          <p><em>Answer all 18 questions to calculate your financial personality type.</em></p>
        </div>
      );
    }

    return (
      <div>
        <link
          rel="stylesheet" href="https://build.origami.ft.com/v2/bundles/css?modules=o-buttons@^4.4.1"
        />

        {/* {chooseQuestions} */}

        {loadStatus}

        {questions}

        {results}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('react-app'));

App.propTypes = {
  questions: React.PropTypes.array,
};
