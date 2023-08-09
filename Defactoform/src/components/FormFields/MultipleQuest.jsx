import React, { Component } from 'react';

class InputField extends React.Component {
    constructor(props){
        super(props);
        this.Props = props;
    }
    
    componentWillMount(){
        console.log(this.Props);
    }
    
    render(){
     return(
         <input type={this.Props.type} name={this.name} placeholder={this.Props.placeholder}/>
     )
    }
} 
export default InputField;