import React, { Component } from 'react';
import './App.css';

class Head extends React.Component {
  render(){
    return(
      <div id="head">
        GAME OF LIFE
      </div>
    );
  }
}
//button to run app
class RunBtn extends React.Component{
  handleRun(){
    this.props.run();
  }
  render(){
    return(
      <div>
        <button onClick={this.handleRun.bind(this)}>RUN</button>
      </div>
    );
  }
}

//button to pause app
class PauseBtn extends React.Component{
  handlePause(){
    this.props.pause();
  }
  render(){
    return(
      <div>
        <button onClick={this.handlePause.bind(this)}>PAUSE</button>
      </div>
    );
  }
}

//button to clear app
class ClearBtn extends React.Component{
  handleClear(){
    this.props.clearBoard();
  }
  render(){
    return(
      <div>
        <button onClick={this.handleClear.bind(this)}>CLEAR</button>
      </div>
    );
  }
}
//button to select slow speed
class SlowBtn extends React.Component{
  handleSetSpeed(){
    this.props.setSpeed(500);
  }
  render(){
    return(
      <div>
        <button onClick={this.handleSetSpeed.bind(this)}>SLOW</button>
      </div>
    );
  }
}
//button to medium speed
class MediumBtn extends React.Component{
  handleSetSpeed(){
    this.props.setSpeed(250);
  }
  render(){
    return(
      <div>
        <button onClick={this.handleSetSpeed.bind(this)}>MEDIUM</button>
      </div>
    );
  }
}
//button to fast speed
class FastBtn extends React.Component{
  handleSetSpeed(){
    this.props.setSpeed(10);
  }
  render(){
    return(
      <div>
        <button onClick={this.handleSetSpeed.bind(this)}>FAST</button>
      </div>
    );
  }
}

//generations counter
class Generations extends React.Component{
  constructor(props){
    super(props);
    this.state={generation:this.props.generation};
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.generation !== this.props.generation){
      this.setState({generation:nextProps.generation});
    }
  }
  render(){
    return(
      <div id="generation">
        <div>Generation:</div>
        <div>{this.state.generation}</div>
      </div>
    );
  }
}

class Cell extends React.Component{
  constructor(props){
    super(props);
    this.state = {cellState:this.props.cellState};
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.cellState !== this.props.cellState){
      this.setState({cellState:nextProps.cellState});
    }
  }
  handleClick(){
    this.props.changeCellStatus(this.props.cellState,this.props.x,this.props.y);
  }
  render(){
    return(
      <div className={"cell "+this.state.cellState} onClick={this.handleClick.bind(this)}>

      </div>
    );
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      cells:this.createArrayCells(),
      generation:0,
      speed:500,
      running:false
    };
  }
  //all the cells go to dead state
  clearBoard(){
    let cells = this.state.cells;
    for(let i=0;i<cells.length;i++){
      for(let j=0;j<cells[i].length;j++){
        if(cells[i][j] === "alive") cells[i][j] = "dead";
      }
    }
    this.setState({cells:cells,generation:0,running:false});
    clearInterval(this.state.intervalId);
  }
  //creates an array of cells
  createArrayCells(){
    let width = 65;
    let height = 40;
    var cells = [];

    for(let i=0;i<height;i++){
      cells.push([]);
      for(let j=0;j<width;j++){
        cells[i].push(this.randomCellState());
      }
    }
    return cells;
  }
  //returns dead or alive randomly
  randomCellState(){
    let min = 1;
    let max = 5;
    if(Math.floor(Math.random()*(max-min+1)+min)===1)return "alive";
    else return "dead";
  }
  //changes the state of a cell
  changeCellState(state,x,y){
    let cells = this.state.cells;
    let newState;
    state === "dead" ? newState = "alive" : newState = "dead";
    cells[y][x] = newState;
    this.setState({cells:cells});
  }
  //initiates app
  run(speed){
    if(speed===undefined) speed = this.state.speed;

    var intervalId = setInterval(()=>{
      let generation = this.state.generation;
      let nextGeneration = this.iterateCells();
      generation++;
      this.setState({generation:generation,cells:nextGeneration});
    }, speed);
    this.setState({intervalId: intervalId,running:true})
  }
  //set the speed
  setSpeed(speed){
    this.setState({speed:speed});
    clearInterval(this.state.intervalId);
    if(this.state.running) this.run(speed);
  }
  //pause the app
  pause(){
    clearInterval(this.state.intervalId);
    this.setState({running:false});
  }
  //iterates the cells array
  iterateCells(){
    let currentCells = this.state.cells;
    let nextCells = [];
    for(let k=0;k<currentCells.length;k++){
      nextCells[k]=[];
    }

    for(let i=0;i<currentCells.length;i++){
      for(let j=0;j<currentCells[0].length;j++){
        if(currentCells[i][j]==="dead") nextCells[i][j] = this.deadCell(currentCells,j,i);
        else nextCells[i][j] = this.aliveCell(currentCells,j,i);
      }
    }
    return nextCells;
  }
  //returns next state of a dead cell
  deadCell(currentCells,x,y){
    let aliveNeighbours = 0;
    let auxX = x;
    let auxY = y;
    //top
    if(y===0){
      if(currentCells[currentCells.length-1][x]==="alive") aliveNeighbours++;
    }else{
      if(currentCells[y-1][x]==="alive") aliveNeighbours++;
    }
    //bottom
    if(y===currentCells.length-1){
      if(currentCells[0][x] ==="alive") aliveNeighbours++;
    }else{
      if(currentCells[y+1][x] ==="alive") aliveNeighbours++;
    }
    //left
    if(x===0){
      if(currentCells[y][currentCells[0].length-1]==="alive") aliveNeighbours++;
    }else{
      if(currentCells[y][x-1]==="alive") aliveNeighbours++;
    }
    //right
    if(x===currentCells[0].length-1){
      if(currentCells[y][0]==="alive") aliveNeighbours++;
    }else{
      if(currentCells[y][x+1]==="alive") aliveNeighbours++;
    }
    //top-left
    if(y===0 || x===0){
      if(y===0) auxY = currentCells.length;
      if(x===0) auxX = currentCells[0].length;
      if(currentCells[auxY-1][auxX-1]==="alive") aliveNeighbours++;
      if(x !== auxX) auxX = x;
      if(y !== auxY) auxY = y;
    }else{
      if(currentCells[y-1][x-1]==="alive") aliveNeighbours++;
    }
    //top-right
    if(y===0 || x===currentCells[0].length-1){
      if(y===0) auxY = currentCells.length;
      if(x===currentCells[0].length-1) auxX = -1;
      if(currentCells[auxY-1][auxX+1]==="alive") aliveNeighbours++;
      if(x !== auxX) auxX = x;
      if(y !== auxY) auxY = y;
    }else{
      if(currentCells[y-1][x+1]==="alive") aliveNeighbours++;
    }
    //bottom-left
    if(y===currentCells.length-1 || x===0){
      if(y===currentCells.length-1) auxY = -1;
      if(x===0) auxX = currentCells[0].length;
      if(currentCells[auxY+1][auxX-1]==="alive") aliveNeighbours++;
      if(x !== auxX) auxX = x;
      if(y !== auxY) auxY = y;
    }else{
      if(currentCells[y+1][x-1]==="alive") aliveNeighbours++;
    }
    //bottom-right
    if(y===currentCells.length-1 || x===currentCells[0].length-1){
      if(y===currentCells.length-1) auxY = -1;
      if(x===currentCells[0].length-1) auxX = -1;
      if(currentCells[auxY+1][auxX+1] ==="alive") aliveNeighbours++;
      if(x !== auxX) auxX = x;
      if(y !== auxY) auxY = y;
    }else{
      if(currentCells[y+1][x+1] ==="alive") aliveNeighbours++;
    }

    if(aliveNeighbours===3) return "alive";
    else return "dead";
  }
  //returns next state of alive cell
  aliveCell(currentCells,x,y){
    let aliveNeighbours = 0;
    let auxX = x;
    let auxY = y;
    //top
    if(y===0){
      if(currentCells[currentCells.length-1][x]==="alive") aliveNeighbours++;
    }else{
      if(currentCells[y-1][x]==="alive") aliveNeighbours++;
    }
    //bottom
    if(y===currentCells.length-1){
      if(currentCells[0][x] ==="alive") aliveNeighbours++;
    }else{
      if(currentCells[y+1][x] ==="alive") aliveNeighbours++;
    }
    //left
    if(x===0){
      if(currentCells[y][currentCells[0].length-1]==="alive") aliveNeighbours++;
    }else{
      if(currentCells[y][x-1]==="alive") aliveNeighbours++;
    }
    //right
    if(x===currentCells[0].length-1){
      if(currentCells[y][0]==="alive") aliveNeighbours++;
    }else{
      if(currentCells[y][x+1]==="alive") aliveNeighbours++;
    }
    //top-left
    if(y===0 || x===0){
      if(y===0) auxY = currentCells.length;
      if(x===0) auxX = currentCells[0].length;
      if(currentCells[auxY-1][auxX-1]==="alive") aliveNeighbours++;
      if(x !== auxX) auxX = x;
      if(y !== auxY) auxY = y;
    }else{
      if(currentCells[y-1][x-1]==="alive") aliveNeighbours++;
    }
    //top-right
    if(y===0 || x===currentCells[0].length-1){
      if(y===0) auxY = currentCells.length;
      if(x===currentCells[0].length-1) auxX = -1;
      if(currentCells[auxY-1][auxX+1]==="alive") aliveNeighbours++;
      if(x !== auxX) auxX = x;
      if(y !== auxY) auxY = y;
    }else{
      if(currentCells[y-1][x+1]==="alive") aliveNeighbours++;
    }
    //bottom-left
    if(y===currentCells.length-1 || x===0){
      if(y===currentCells.length-1) auxY = -1;
      if(x===0) auxX = currentCells[0].length;
      if(currentCells[auxY+1][auxX-1]==="alive") aliveNeighbours++;
      if(x !== auxX) auxX = x;
      if(y !== auxY) auxY = y;
    }else{
      if(currentCells[y+1][x-1]==="alive") aliveNeighbours++;
    }
    //bottom-right
    if(y===currentCells.length-1 || x===currentCells[0].length-1){
      if(y===currentCells.length-1) auxY = -1;
      if(x===currentCells[0].length-1) auxX = -1;
      if(currentCells[auxY+1][auxX+1] ==="alive") aliveNeighbours++;
      if(x !== auxX) auxX = x;
      if(y !== auxY) auxY = y;
    }else{
      if(currentCells[y+1][x+1] ==="alive") aliveNeighbours++;
    }

    if(aliveNeighbours===3 || aliveNeighbours===2) return "alive";
    else if(aliveNeighbours < 2 || aliveNeighbours > 3) return "dead";
  }
  render() {
    var boardCells = [];
    for(let j=0;j<this.state.cells.length;j++){
      this.state.cells[j].map((cell,i)=>{
      return(
        boardCells.push(<Cell key={i+"-"+j} x={i} y={j} cellState={cell} changeCellStatus={this.changeCellState.bind(this)}/>)
      );
    })
    }
    return (
      <div className="App">
        <Head />
        <div id="main">
          <div id="menu">
            <RunBtn run={this.run.bind(this)} />
            <PauseBtn pause={this.pause.bind(this)}/>
            <ClearBtn clearBoard={this.clearBoard.bind(this)}/>
            <SlowBtn setSpeed={this.setSpeed.bind(this)}/>
            <MediumBtn  setSpeed={this.setSpeed.bind(this)}/>
            <FastBtn setSpeed={this.setSpeed.bind(this)}/>
            <Generations generation={this.state.generation}/>
          </div>
          <div id="game">
            <div id="board">
            {boardCells}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
