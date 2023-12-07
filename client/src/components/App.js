import React, { Component } from 'react';
import { Route } from "react-router-dom";
import cookie from 'react-cookies';
import axios from "axios";
import $ from 'jquery';

// css
import '../css/new.css';

// header
import Header from './Header/Header';


import MainForm from './Main/MainForm';
import MainForm2 from './Main/MainForm2';


// footer
import Footer from './Footer/Footer';

// login
import LoginForm from './LoginForm';

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
// import Write from './Board/Write';

import ContentView2 from './Board/ContentView2';
import SoftwareList from './SoftwareToolsManage/SoftwareList';
import SoftwareView from './SoftwareToolsManage/SoftwareView';

import CarRegister from './Register/CarRegister';
import Register from './Register/Register';
import Register_co from './Register/Register_co';
import ReRegister from './Register/ReRegister';
import PwChangeForm from './PwChangeForm';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pw: '', 
    }
  }

  componentDidMount() {
    if(window.location.pathname.indexOf('/login') != -1){
      $('.menulist').hide()
      $('.hd_top').hide()
    }
    if(window.location.pathname.indexOf('/PwChangeForm') == -1){
      //this.setState({email: 'bao@naver.com'});
      //this.setState({pw: '234'});
      let email = '';     
      let pw = '';
      axios.post('/api/member/loginCookie', {
        //email: email,
        //pw: pw
        email: cookie.load('email'),
        pw: cookie.load('pw')
      }).then( response => {
        if(response.data.email == undefined){
          this.noPermission();
        } else {
          //alert("1. niname="+response.data.niname);
        }
      }).catch( error => {
        this.noPermission();
      })
    }
  }
    



    //   axios.post('/api/member/loginPost', {
    //      token1 : cookie.load('email'),
    //      token2 : cookie.load('niname') 
    //   })
    //   .then( response => {
    //       this.state.email = response.data.token1
    //       let password = cookie.load('pw')
    //       if(password !== undefined){
    //         axios.post('/api/member/loginPost', {
    //           email: this.state.email,
    //           is_Token : password
    //         })
    //         .then( response => {
    //           if(response.data.email == undefined){
    //             this.noPermission()
    //           }
    //         })
    //         .catch( error => {
    //           this.noPermission()
    //         });
    //       }else{
    //         this.noPermission()
    //       }
    //   })
    //   .catch( response => this.noPermission());
    //  }
  

  noPermission = (e) => {
    if(window.location.hash != 'nocookie'){
      this.remove_cookie();
      window.location.href = '/login/#nocookie';
    }
  };

  remove_cookie = (e) => {
    cookie.remove('email', { path: '/'});
    cookie.remove('niname', { path: '/'});
    cookie.remove('pw', { path: '/'});
  }

  render () {
    return (
      
      <div className="App">
        
        <Header/> 
        <Route exact path='/' component={LoginForm} />
        <Route path='/login' component={LoginForm} />
        
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
        {/* <Route path='/Write/' component={Write} /> */}

        <Route path='/ContentView2/:bid' component={ContentView2} />
        <Route path='/SoftwareList' component={SoftwareList} />
        <Route path='/SoftwareView/:swtcode' component={SoftwareView} />
        <Route path='/Register' component={Register} />
        <Route path='/Register_co' component={Register_co} />
        <Route path='/ReRegister/' component={ReRegister} />
        <Route path='/CarRegister' component={CarRegister} />
        <Route path='/PwChangeForm/:email/:token' component={PwChangeForm} />

        <Footer/>
      </div>
      
    );
   
  };
}

export default App;