import React, { Component } from 'react';
import { Route } from "react-router-dom";
import cookie from 'react-cookies';
import axios from "axios";

// css
import '../css/new.css';

// header
import HeaderAdmin from './Header/Header admin';


import MainForm from './Main/MainForm';
import MainForm2 from './Main/MainForm2';


// footer
import Footer from './Footer/Footer';

// login
import LoginForm from './LoginForm';
import LoginForm_co from './LoginForm_co';


import QBoardList from './Board/QBoardList';
import QBoardView from './Board/QBoardView';
import NBoardList from './Board/NBoardList';
import NBoardView from './Board/NBoardView';
import FBoardList from './Board/FBoardList';
import FBoardView from './Board/FBoardView';
import RBoardList from './Board/RBoardList';
import RBoardView from './Board/RBoardView';
import ContentView from './Board/ContentView';
import ContentView_ex from './Board/ContentView_ex';
import View from './Board/View';

import ContentView2 from './Board/ContentView2';
import SoftwareList from './SoftwareToolsManage/SoftwareList';
import SoftwareView from './SoftwareToolsManage/SoftwareView';

import CarRegister from './Register/CarRegister';
import Register from './Register/Register';
import Register_co from './Register/Register_co';
import ReRegister from './Register/ReRegister';
import PwChangeForm from './PwChangeForm';

import CommentList from './Comment/CommentList';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    if(window.location.pathname.indexOf('/PwChangeForm') == -1){
      axios.post('/api/LoginForm?type=SessionConfirm', {
        token1 : cookie.load('userid') 
        , token2 : cookie.load('username') 
      })
      .then( response => {
          this.state.userid = response.data.token1
          let password = cookie.load('userpassword')
          if(password !== undefined){
            axios.post('/api/LoginForm?type=SessionSignin', {
              is_Email: this.state.userid,
              is_Token : password
            })
            .then( response => {
              if(response.data.json[0].useremail == undefined){
                this.noPermission()
              }
            })
            .catch( error => {
              this.noPermission()
            });
          }else{
            this.noPermission()
          }
      })
      .catch( response => this.noPermission());
    }
  }

  noPermission = (e) => {
    if(window.location.hash != 'nocookie'){
      this.remove_cookie();
      window.location.href = '/login_co/#nocookie';
    }
  };

  remove_cookie = (e) => {
    cookie.remove('userid', { path: '/'});
    cookie.remove('username', { path: '/'});
    cookie.remove('userpassword', { path: '/'});
  }

  render () {
    return (
      
      <div className="App">
        
        <HeaderAdmin/> 
        <Route exact path='/' component={LoginForm_co} />
        <Route path='/login' component={LoginForm} />
        <Route path='/login_co' component={LoginForm_co} />
        
        <Route path='/MainForm' component={MainForm} />
        <Route path='/QBoardList' component={QBoardList} />
        <Route path='/QBoardView/:bid' component={QBoardView} />
        <Route path='/NBoardList' component={NBoardList} />
        <Route path='/NBoardView/' component={NBoardView} />
        <Route path='/FBoardList' component={FBoardList} />
        <Route path='/FBoardView/:bid' component={FBoardView} />
        <Route path='/RBoardList' component={RBoardList} />
        <Route path='/RBoardView/:bid' component={RBoardView} />
        <Route path='/ContentView/:bid' component={ContentView} />
        <Route path='/ContentView_ex/:bid' component={ContentView_ex} />
        <Route path='/View/:bid' component={View} />

        <Route path='/ContentView2/:bid' component={ContentView2} />
        <Route path='/SoftwareList' component={SoftwareList} />
        <Route path='/SoftwareView/:swtcode' component={SoftwareView} />
        <Route path='/Register' component={Register} />
        <Route path='/Register_co' component={Register_co} />
        <Route path='/ReRegister' component={ReRegister} />
        <Route path='/CarRegister' component={CarRegister} />
        <Route path='/PwChangeForm/:email/:token' component={PwChangeForm} />

        <Route path='/CommentList' component={CommentList} />


        <Footer/>
      </div>
      
    );
   
  }
}

export default App;