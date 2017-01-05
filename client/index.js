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
  }

  componentDidMount() {
    this.setQuestions();
  }

  setQuestions() {
    const questions = JSON.parse(document.getElementById('questions-data').textContent);

    this.setState({
      questions,
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

    document.getElementById(`q${nextQuestion}`).scrollIntoView({ behavior: 'smooth' });
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

    const endpoint = 'https://ft-ig-answer-api.herokuapp.com/api/v1';
    fetch(`${endpoint}/response/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: scoreSorted[5].category,
        submitted: Date.now(),
        questionId: 29, // Magic number via Answer API.
        meta: {
          score: scoreSorted,
        },
      }),
    }).then(res => console.log(res)).catch(e => console.error(e));
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
    let userType = null;
    let typeDesc = null;
    let results = null;

    switch (true) {
      case this.state.result === 'fitbit':
        userType = 'the ‘Fitbit financier’';
        typeDesc = 'Go on, admit it. You track your spending, investments and pension about as often as someone training for an extreme sporting event measures their calorie intake, resting heart rate and sleep quality. You like to use comparison sites, consider some people on money discussion forums to have become your friends friends, and like to download apps that help you understand financial products and remind you when to remortgage. Keeping track of one’s money is a good thing. But one underlying reason for wanting very strong control of your finances is that you may have lost control of other areas of your life. Perhaps you are facing something unpredictable, like a job move or retirement?'; // eslint-disable-line
        break;
      case this.state.result === 'anxious':
        userType = 'the ‘anxious investor’';
        typeDesc = 'You check or change your investments several times a month. Quite possibly most days. The anticipation of making a trade or checking your portfolio boosts your mood, although after it is executed you are anxious about what the results will be. According to behavioural finance expert Greg B. Davies, that is a brain chemistry loop that keeps amateur investors trading through periods when they really should have bought and held. Some move on to chasing the highs and suffering the lows of leveraged spread betting. Mr Davies observes that many DIY investors believe they are better than the average. However, they often have no idea how their portfolio is doing compared to an accepted benchmark, or even what this benchmark should be. If you fear this is you, see a financial adviser or chartered financial planner for a portfolio MOT.'; // eslint-disable-line
        break;
      case this.state.result === 'social':
        userType = 'the ‘social value spender’';
        typeDesc = 'Ever had a row with a loved one that you felt better about after buying them a gift? Do you shop online when you feel lonely? If so, you may be what psychologists call a social value spender. You use money as a tool to make yourself feel better. The extreme manifestation of this behaviour is shopping addiction, where sufferers may have unopened packages hidden under beds and in toilet cisterns, or simply put their purchases on eBay straight away. At the moderate end of the spectrum, you may find yourself lured by retail advertising tactics that link consumption of small, luxury items to a mood boost. Scented candle, anyone?'; // eslint-disable-line
        break;
      case this.state.result === 'cash':
        userType = 'the ‘cash splasher’';
        typeDesc = 'Do you always get the bill? More importantly, do you always get the bill while making it clear to others that you were then one who paid? Cash splashers view themselves as generous, but they also use money to show people that they have achieved enough success in life for spending freely on others not to make a dent. They may also spend on items or commitments that they could easily do without, from club memberships to expensive cars, to show others that they have done well. It is always nice to be a bit of a splasher, but do keep it in check.'; // eslint-disable-line
        break;
      case this.state.result === 'hoarder':
        userType = 'the ‘hoarder’';
        typeDesc = 'To you, money represents security. You like to see enormous piles of it in your bank account. You are uncomfortable with investing because moves money out of sight and into that unknown dimension known as “the markets”, where it could lose value. You find shopping horrid. If you are married, you will question your spouse’s spending. If you have teenage children, you also have a wardrobe of clothes that are older than them. In a divorce, you may fight for more of the spoils than you need, for fear of being left short. And if you retire comfortably, you will still deny yourself luxuries, perhaps while also fretting uncontrollably about inheritance tax. If you find yourself hoarding beyond what is necessary, try and recalibrate how you conceptualise money. It is not tangible, but abstract. It has been variously described as the future promise of having something, a legal obligation or simply a unit of measurement. So if you do not use it, it may as well not exist.'; // eslint-disable-line
        break;
      case this.state.result === 'ostrich':
        userType = 'the ‘ostrich’';
        typeDesc = 'Money? Yawn. You hate opening bills. Pensions and Isas are dull. Quite possibly you once paid a monthly direct debit for a washing machine that was installed in your student house, before canceling it a decade later. At the root of your inactivity is anxiety. You see yourself as innately bad with numbers. So you fear that making any decision about money could be worse than doing nothing. It is not a rational fear. The good news is that, if you have taken this test, which involves thinking about money, you are not an incurable ostrich. Set aside an hour a fortnight, at first, to examine your finances. It will get easier with time.'; // eslint-disable-line
        break;
      default:
        userType = 'calculating…';
    }

    if (complete) {
      results = (
        <div className="results">
          {!this.state.tie &&
            <div>
              <h2>Your financial personality type: {userType}</h2>

              <p>{typeDesc}</p>
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

          {!this.state.tie &&
            <a
              href={`https://twitter.com/intent/tweet?text=How%20well%20do%20you%20really%20know%20your%20country%3F%20My%20${this.state.country}%20rating%20was%20${Math.round(this.state.score)}%25%3B%20see%20how%20you%20compare%3A&url=https%3A%2F%2Fig.ft.com%2Fsites%2Fquiz%2Fperils-of-perception%2F2016%2F&via=FT`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="o-buttons o-buttons--big o-buttons--standout"
              >
                Tweet Your Result
              </button>
            </a>
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
