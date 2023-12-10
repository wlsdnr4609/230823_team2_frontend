import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import axios from "axios";
// import cookie from 'react-cookies';
import $ from 'jquery';
// import Swal from 'sweetalert2';

class MainForm2 extends Component {
    componentDidMount() {
        if (window.location.pathname.indexOf('/login') != -1) {
            $('.menulist').hide()
            $('.hd_top').hide()
        }
    }
    myInfoHover () {
        $(".hd_left2 > li > .box1").stop().fadeIn(400);
    }
    
    myInfoLeave () {
        $(".hd_left2 > li > .box1").stop().fadeOut(400);
    }
    render() {
        return (
            <div className="gnb_box2">
                <div className="hd_top2">
                    <div className="top_wrap2 ct1 af">
                        <ul className="hd_left2 af">
                            <li className="my1" onMouseEnter={this.myInfoHover}
                                onMouseLeave={this.myInfoLeave}><b>join</b>
                                <div className="box0 box1">
                                    <ul>
                                        <li><a href={'/Register'} >회원가입</a></li>
                                        <li><a href='/login' >로그인</a></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                        <div className="hd_right">
                            <p>전기차 충전소 검색은 "어디야"</p>
                        </div>
                    </div>
                </div>
                <div className="h_nav2 ct1 af">
                    <nav className="gnb gnb_admin">
                        <ul className="af">

                            {/* <li className="menulist">
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
                            </li> */}

                        </ul>
                    </nav>
                </div>

                <section class="sub_wrap2" >
                    <article class="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                        <img src={require("../../img/main/충전소001.png")} height="650px" width="1500px"></img>
                    </article>
                </section>
            </div>
        );
    }
}

export default MainForm2;