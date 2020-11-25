import React from 'react';
import cx from 'classnames';

import {
  tiles,
  shuffle,
  sortTiles,
  drawTiles
} from './utils/tiles';

import './App.css';

const config = {
  handSize: 16
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTile: undefined,
      hand: [],
      discard: [],
      deck: shuffle(tiles.slice(0)),
      outside: [],
      showDebuger: false,
      autoSend: 'none', //none, discard, outside
      shouldAutoSort: true,
    }

    this.onResetClick = this.onResetClick.bind(this);
    this.drawNewHand = this.drawNewHand.bind(this);
    this.onDrawSingleTileClick = this.onDrawSingleTileClick.bind(this);
    this.renderTiles = this.renderTiles.bind(this);
    this.toggleDebugger = this.toggleDebugger.bind(this);
    this.selectTile = this.selectTile.bind(this);
    this.onSendToOutsideClick = this.onSendToOutsideClick.bind(this);
    this.onSendToDiscardClick = this.onSendToDiscardClick.bind(this);
    this.sortHand = this.sortHand.bind(this);
    this.onAutoSendChange = this.onAutoSendChange.bind(this);
    this.onShouldAutoSortChange = this.onShouldAutoSortChange.bind(this);
  }

  autoSort(tiles) {
    return this.state.shouldAutoSort ? sortTiles(tiles) : tiles;
  }

  onResetClick() {
    let newState = { hand: [], discard: [], outside: [], deck: shuffle(tiles.slice(0)) };
    newState.hand = this.autoSort(newState.deck.splice(0, config.handSize));
    this.setState(newState)
  }

  drawNewHand() {
    let { hand, deck } = this.state;
    let tempHand = this.autoSort(drawTiles(config.handSize, hand, deck));
    this.setState({hand: tempHand});
  }

  onDrawSingleTileClick() {
    let { hand, deck } = this.state;
    let tempHand = drawTiles(1, hand, deck);
    this.setState({hand: tempHand})
  }

  toggleDebugger() {
    this.setState({showDebuger: !this.state.showDebuger});
  }

  selectTile(index) {
    let { autoSend } = this.state;
    if (autoSend === 'none') {
      this.setState({selectedTile: index});
    } else if (autoSend === 'outside') {
      this.sendTo('outside', index);
    } else if (autoSend === 'discard') {
      this.sendTo('discard', index);
    }
  }

  onSendToOutsideClick() {
    let { selectedTile } = this.state;
    this.sendTo('outside', selectedTile);
  }

  onSendToDiscardClick() {
    let { selectedTile } = this.state;
    this.sendTo('discard', selectedTile);
  }

  sortHand() {
    this.setState({hand: sortTiles(this.state.hand)});
  }

  renderTiles(tiles) {
    if (!tiles || tiles.length === 0 ) {
      return <div>No tiles in this area yet.</div>
    }
    return tiles.map( (tile, index) => {
      let className = cx('tile', {
        isSelected: this.state.selectedTile === index
      })
      return (
        <img
          className={className}
          onClick={() => this.selectTile(index)}
          src={`./images/${tile}.jpg`}
        />
      )
    });
  }

  onAutoSendChange(e) {
    this.setState({autoSend: e.target.value})
  }

  onShouldAutoSortChange(e) {
    this.setState({shouldAutoSort: e.target.checked})
  }

  sendTo(location, ind) {
    // location === 'discard' or 'outside'
    let { hand, discard, outside } = this.state;
    let tempTile = hand.splice(ind, 1);
    let tempLocation;
    if (location === 'outside') {
      tempLocation= outside.slice(0);
      tempLocation.push(tempTile[0]);
    } else if (location === 'discard') {
      tempLocation = discard.slice(0);
      tempLocation.push(tempTile[0]);
    }
    this.setState({[location]: tempLocation, selectedTile: undefined, hand: this.autoSort(hand)});
  }

  componentDidMount() {
    this.drawNewHand();
  }

  render() {
    return (
      <div className='root'>
        <div className='controlPanel'>
          <button onClick={this.toggleDebugger}>Show/Hide Debugger</button>
          <br /><br /><br />
          <div className='controlPanelButton'>
            <button onClick={this.onResetClick}>Reset</button>
          </div>
          <br /> <hr /> <br />
          <div className='controlPanelButton'>
            <button onClick={this.onDrawSingleTileClick}>Draw ONE Tile</button>
          </div>
          <div className='controlPanelButton'>
            <button onClick={this.sortHand}>Sort Hand</button>
          </div>
          <br /> <hr /> <br />
          <label>
            Auto Sort: {this.state.shouldAutoSort ? 'CURRENTLY ON' : 'CURRENTLY OFF'}
          </label>
          <div className='controlPanelRadio' onChange={this.onShouldAutoSortChange}>
            <div>
              <label>Toggle Auto Sort: </label>
              <input type='checkbox'
                onChange={this.state.onShouldAutoSortChange}
                checked={this.state.shouldAutoSort}
              />
            </div>
          </div>
          <br /> <hr /> <br />
          <label>Auto Send:</label>
          <div className='controlPanelRadio' onChange={this.onAutoSendChange}>
            <input type='radio' value='none'
              checked={this.state.autoSend === 'none'} /> None
            <input type='radio' value='outside'
              checked={this.state.autoSend === 'outside'} /> Outside
            <input type='radio' value='discard'
              checked={this.state.autoSend === 'discard'} /> Discard
          </div>
          <br /> <hr /> <br />
          <div className='controlPanelButton'>
            <button onClick={this.onSendToOutsideClick}>Send OUTSIDE</button>
          </div>
          <div className='controlPanelButton'>
            <button onClick={this.onSendToDiscardClick}>Send DISCARD</button>
          </div>
        </div>


        <div className='content'>
          <div className='gameArea'>
            <label className='gameAreaLabel'>Tiles in Deck:</label>
            <div>{this.state.deck.length}</div>
            <label className='gameAreaLabel'>Hand Area:</label>
            <div className='handArea'>
              {this.renderTiles(this.state.hand)}
            </div>
            <label className='gameAreaLabel'>Outside Area:</label>
            <div className='outsideArea'>
              {this.renderTiles(this.state.outside)}
            </div>
            <label className='gameAreaLabel'>Discard Area:</label>
            <div className='discardArea'>
              {this.renderTiles(this.state.discard)}
            </div>
          </div>
          <div className='debugger'>
            <pre>Hand Size: {this.state.hand.length}</pre>
            <pre>Deck Size: {this.state.deck.length}</pre>
            <pre>Selected Tile: {this.state.selectedTile}</pre>
            {this.state.showDebuger && <pre>{JSON.stringify(this.state, null, 2)}</pre>}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
