import React from 'react';
import { Button } from 'reactstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './css/GameSelector.css';
import {db} from '../firebase';

export default class GameSelector extends React.Component {

  constructor(){
      super();
      this.state = {
          specs:null,
          selectedSpec: null
      };
  }

  loadGame(event){
      if(this.state.selectedSpec){
          this.props.setSpecId(this.state.selectedSpec.id);
          this.props.setSpec(this.state.selectedSpec.value);
      }else{
          // TODO:
          // Show some error message
      }
  }

  componentDidMount(){
      this.loadSpecs();
  }

  loadSpecs(){
      let specRef = db.ref('gameBuilder/gameSpecs');
      let self = this;
      specRef.on("value",function(snapshot){
          let specs = snapshot.val();
          let list = [];
          for(let specKey in specs){
              list.push({
                value: specs[specKey],
                label: specs[specKey].gameName,
                id: specKey
            });
          }
        self.setState({specs:list});
      })
  }

  changeSelectedSpec(event){
      this.setState({
          selectedSpec: event
      });
  }

  addMember(){
      this.props.addMember();
  }

  render() {
    return (
        <div className='game-selector-container'>
            <Select
              className="spec-selector"
              name="form-field-name"
              value={this.state.selectedSpec}
              options={this.state.specs}
              onChange={this.changeSelectedSpec.bind(this)}
            />
            <Button color="success load-game-btn" onClick={this.loadGame.bind(this)}>Load Game</Button>
            <Button color="success load-game-btn" onClick={this.addMember.bind(this)}>
                {this.props.addingMember ?
                    "Cancel" :
                    "Add Member"}
            </Button>
        </div>
    );
  }
}
