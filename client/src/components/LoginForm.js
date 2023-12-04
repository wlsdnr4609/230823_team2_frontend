import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import cookie from 'react-cookies';
import Swal from 'sweetalert2';
import $ from 'jquery';

class LoginForm extends Component {
    submitClick = (e) => {
        this.email_val = $('#email_val').val();
        this.pwd_val = $('#pwd_val').val();
        if(this.email_val === '' || this.pwd_val === ''){
            this.sweetalert('1. 이메일과 비밀번호를 확인해주세요.', '', 'info', '닫기')
        }else{
            axios.post('/api/loginPost', {
                email: this.email_val,
                pw: this.pwd_val
            })
            .then( response => {
                var email = response.data.email
                var niname = response.data.niname
                var pw = response.data.pw
                //alert("response.data="+response.data.email);
                
                // if(response.data.email != undefined) {
                //     this.sweetalert('로그인 되었습니다.', '', 'info', '닫기')
                //     const expires = new Date()
                //     expires.setMinutes(expires.getMinutes() + 60)
                //     cookie.save('email', response.data.email
                //         , { path: '/', expires })
                //         cookie.save('niname', response.data.niname
                //         , { path: '/', expires })
                //         cookie.save('pw', response.data.pw
                //         , { path: '/', expires })
                //     setTimeout(function() {
                //         window.location.href = '/MainForm';
                //     }.bind(this),1000);
                // } else{
                //     this.sweetalert('2. 이메일과 비밀번호를 확인해주세요.', '', 'info', '닫기')
                // }

                if(email != null && email != ''){
                    // this.sweetalert('로그인 되었습니다.', '', 'info', '닫기')
                    const expires = new Date()
                    expires.setMinutes(expires.getMinutes() + 60)
                    
                    axios.post('http://192.168.0.47:8080/api/loginPost', {
                        email: email,
                        niname: niname,
                    })
                    .then( response => {
                        cookie.save('email', response.data.token1
                        , { path: '/', expires })
                        cookie.save('niname', response.data.token2
                        , { path: '/', expires })
                        cookie.save('pw', pw
                        , { path: '/', expires })
                    })  
                    .catch( error => {
                        this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');
                    });
                    
                    setTimeout(function() {
                        window.location.href = '/login';
                    }.bind(this),1000);
                }else{
                    this.sweetalert('2. 이메일과 비밀번호를 확인해주세요.', '', 'info', '닫기')
                }

                
            })
            .catch( error => {this.sweetalert('3. 이메일과 비밀번호를 확인해주세요.', '', 'info', '닫기')} );
        }
    }

    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
          })
    }
    //비밀번호 잊어버렸을때 비밀번호 변경
    // pwdResetClick = () => {
    //     $('.signin').hide();
    //     $('.chgpw').fadeIn();
    //     $('.chgpw').css('display','table-cell');
    // }

    // pwdResetCancleClick = () => {
    //     $('.chgpw').hide();
    //     $('.signin').fadeIn();
    //     $('.signin').css('display','table-cell');
    // }

    // pwdResetConfim = (e) => {
    //     this.reset_email = $('#reset_email_val').val();
    //     this.reset_name = $('#reset_name_val').val();
    //     if(this.reset_email === '' || this.reset_name === ''){
    //         this.sweetalert('이메일과 성명을 확인해주세요.', '', 'info', '닫기')
    //     }else{
    //         axios.post('/api/LoginForm?type=pwreset', {
    //             is_Email: this.reset_email,
    //             is_Name: this.reset_name,
    //         })
    //         .then( response => {
    //             var userpassword = response.data.json[0].userpassword
    //             userpassword = userpassword.replace(/\//gi,"가")
                
    //             if(userpassword != null && userpassword != ''){
    //                 this.sendEmail(this.reset_email, 'react200 비밀번호 재설정 메일', userpassword)
    //             }else{
    //                 this.sweetalert('이메일과 성명을 확인해주세요.', '', 'info', '닫기')
    //             }
    //         })
    //         .catch( error => {
    //             this.sweetalert('이메일과 성명을 확인해주세요.', '', 'info', '닫기')
    //         });
    //     }
    // }

    // sendEmail = (email, subject, password, e) => {
    //     axios.post('/api/mail', {
    //         is_Email : email,
    //         is_Subject : subject,
    //         is_Password: password
    //     })
    //     .then( response => {
    //         if(response.data == "succ"){
    //             this.sweetalert('입력하신 이메일로 비밀번호 \n'
    //             + '재설정 메일 보내드렸습니다.', '', 'info', '닫기')
    //         }else{
    //             this.sweetalert('작업중 오류가 발생하였습니다.', '', 'error', '닫기');
    //         }
    //     })
    //     .catch( error => {
    //         this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');
    //     });
    // }

    // sweetalert = (title, contents, icon, confirmButtonText) => {
    //     Swal.fire({
    //         title: title,
    //         text: contents,
    //         icon: icon,
    //         confirmButtonText: confirmButtonText
    //       })
    // }

    render () {
        return (
            <section className="main">
               
                <div className="m_login signin">
                <div className="login_form_box">
                <h3><span><img src={require("../img/main/log_img.png")} alt="" />
                </span>LOGIN</h3>
                <div className="log_box">
                    <div className="in_ty1">
                        <span><img src={require("../img/main/m_log_i3.png")} alt="" /></span>
                        <input type="text" id="email_val" placeholder="이메일" />
                    </div>
                    <div  className="in_ty1">
                        <span className="ic_2">
                            <img src={require("../img/main/m_log_i2.png")} alt="" />
                        </span>
                        <input type="password" id="pwd_val" placeholder="비밀번호" />
                    </div>
                    <ul className="af">
                        <li><Link to={'/Register'}>회원가입</Link></li>
                        <li className="pwr_b" onClick={this.pwdResetClick}><a href="#n">비밀번호 재설정</a></li>
                    </ul>
                    
                    <div className="s_bt" type="" onClick={(e) => this.submitClick(e)} >로그인</div>
                </div>
                </div>
                </div>
                <div className="m_login m_pw chgpw">
                <h3 className="pw_ls">비밀번호 재설정 <span className="compl1">완료</span></h3>
                <div className="log_box">
                    <div className="pw_one">
                        <div className="in_ty1">
                        <span><img src={require("../img/main/m_log_i3.png")} alt="" /></span>
                        <input type="text" id="reset_email_val" name="" placeholder="이메일"/>
                        </div>
                        <div  className="in_ty1">
                        <span className=""><img src={require("../img/main/m_log_i1.png")} alt="" /></span>
                        <input type="text" id="reset_name_val" name="" placeholder="성명"/>
                        </div>
                        <div className="btn_confirm btn_confirm_m">
                        <div className="bt_ty bt_ty_m bt_ty1 cancel_ty1" 
                        onClick={this.pwdResetCancleClick}>취소</div>
                        <a href="#n" className="bt_ty bt_ty_m bt_ty2 submit_ty1" 
                        onClick={this.pwdResetConfim}>확인</a>
                        </div>
                    </div>
                </div>
                </div>
                
            </section>
        );
    }
}

export default LoginForm;