import React, {Component} from 'react'
import { Link } from 'react-router-dom'
//import { notify } from 'react-notify-toast'
import Loader from '../../components/Common/Loader'
export default class Confirm extends Component {
  
   state = {
    confirming: true
  }

   componentDidMount = () => {
    const { id } = this.props.match.params

    fetch("http://localhost:3000/confirm/5c40d7607d259400989a9d42"+id)
      .then(res => res.json())
      .then(data => {
        this.setState({ confirming: false })
        //notify.show(data.msg)
      })
      .catch(err => console.log(err))
  }
   render = () =>
    <div className='confirm'>
      {this.state.confirming
        ? <Loader size='8x' spinning={'spinning'} /> 
        : <Link to='./Register'>
            <Loader size='8x' spinning={''} /> 
          </Link>
      }
    </div>
}