import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import cookie from 'react-cookies';
import $ from 'jquery';
import Swal from 'sweetalert2';


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            niname:'',
        };
    }
    componentDidMount() {
        
        if(window.location.pathname.indexOf('/login') != -1){
            $('.menulist').hide()
            $('.hd_top').hide()
            // $('.logo').hide()
        }

        var cookie_userid = cookie.load('email')
        var cookie_usernm = cookie.load('niname')
        var cookie_password = cookie.load('pw')
        this.setState({niname : cookie_usernm})
        
        if(cookie_userid != undefined){
            const expires = new Date()
            expires.setMinutes(expires.getMinutes() + 60)

            cookie.save('email', cookie_userid
            , { path: '/', expires })
            cookie.save('niname', cookie_usernm
            , { path: '/', expires })
            cookie.save('pw', cookie_password
            , { path: '/', expires })

            $('.menulist').show()
            $('.hd_top').show()
        }else{
            $('.menulist').hide()
            $('.hd_top').hide()
        }
    }

    callSessionInfoApi = (type) => {
        axios.post('/api/member/loginPost', {
            token1 : cookie.load('email'),
            token2 : cookie.load('niname') 
        })
        .then( response => {
            this.setState({niname : response.data.niname})
        })
        .catch( error => {
            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');
        });
    }

    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
          })
    }

    myInfoHover () {
        $(".hd_left > li > .box1").stop().fadeIn(400);
    }
    
    myInfoLeave () {
        $(".hd_left > li > .box1").stop().fadeOut(400);
    }

    logout = async e => {
        cookie.remove('email', { path: '/'});
        cookie.remove('niname', { path: '/'});
        cookie.remove('pw', { path: '/'});
        window.location.href = '/login';
    }

    render () {
        return(
            <header className="gnb_box">
            <div className="hd_top">
                <div className="top_wrap ct1 af">
                <ul className="hd_left af">
                <li className="my1" onMouseEnter={this.myInfoHover}
                onMouseLeave={this.myInfoLeave}><b>내정보</b>
                        <div className="box0 box1">
                            <ul>
                            <li><a href='/CarRegister' >차량정보등록</a></li>
                            <li><a href='/ReRegister' >내 정보 수정</a></li>
                            <li><a href="javascript:" onClick={this.logout}>로그아웃</a></li>
                            </ul>
                        </div>
                        </li>
                    <li className="my2"><b><span>0</span>알림</b>
                    </li>
                </ul>
                <div className="hd_right">
                    <p><span>'{this.state.niname}'</span>님 반갑습니다.</p>
                </div>
                </div>
            </div>
                <div className="h_nav ct1 af">
                    <div className="logo">
                        <Link to={'/Mainform2'}><img src={require("../../img/layout/carlogo001.png")} height="65px" width="200px" alt=""/></Link>
                    </div>
                    <nav className="gnb gnb_admin">
                    <ul className="af">
                         
                        <li className="menulist">
                            <Link to={'/SoftwereView'}>충전소 검색</Link>
                        </li>
                        <li className="menulist">
                            <Link to={'/NBoardList'}>공지사항</Link>
                        </li>
                        <li className="menulist" >
                            <Link to={'/FBoardList'}>자유게시판</Link>
                            
                        </li>
                        <li className="menulist">
                            <Link to={'/RBoardList'}>리뷰</Link>
                        </li>
                        <li className="menulist">
                            <Link to={'/QBoardList'}>문의</Link>
                        </li>
                        
                    </ul>
                    </nav>
                </div>
            </header>
        );
    }
}

export default Header;