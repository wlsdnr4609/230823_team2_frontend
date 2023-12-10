import React, { Component } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import $ from 'jquery';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            full_email: '',
            full_niname: '',
        }
    }

    submitClick = async (type, e) => {

        this.email_val_checker = $('#email_val').val();
        this.email2_val_checker = $('#email2_val').val();
        this.pwd_val_checker = $('#pwd_val').val();
        this.pwd_cnf_val_checker = $('#pwd_cnf_val').val();
        this.name_val_checker = $('#name_val').val();
        this.niname_val_checker = $('#niname_val').val();

        this.fnValidate = (e) => {
            var pattern1 = /[0-9]/;
            var pattern2 = /[a-zA-Z]/;
            var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

            if (this.email_val_checker === '') {
                $('#email_val').addClass('border_validate_err');
                this.sweetalert('이메일 주소를 다시 확인해주세요.', '', 'info', '닫기')
                return false;
            }
            if (this.email_val_checker.search(/\s/) !== -1) {
                $('#email_val').addClass('border_validate_err');
                this.sweetalert('이메일 공백을 제거해 주세요.', '', 'info', '닫기')
                return false;
            }
            $('#email_val').removeClass('border_validate_err');


            if (this.pwd_val_checker === '') {
                $('#pwd_val').addClass('border_validate_err');
                this.sweetalert('비밀번호를 입력해주세요.', '', 'info', '닫기')
                return false;
            }
            if (this.pwd_val_checker !== '') {
                var str = this.pwd_val_checker;
                if (str.search(/\s/) !== -1) {
                    $('#pwd_val').addClass('border_validate_err');
                    this.sweetalert('비밀번호 공백을 제거해 주세요.', '', 'info', '닫기')
                    return false;
                }
                if (!pattern1.test(str) || !pattern2.test(str) || !pattern3.test(str)
                    || str.length < 8 || str.length > 16) {
                    $('#pwd_val').addClass('border_validate_err');
                    this.sweetalert('8~16자 영문 대 소문자\n숫자, 특수문자를 사용하세요.', '', 'info', '닫기')
                    return false;
                }
            }
            $('#pwd_val').removeClass('border_validate_err');

            if (this.pwd_cnf_val_checker === '') {
                $('#pwd_cnf_val').addClass('border_validate_err');
                this.sweetalert('비밀번호 확인을 입력해주세요.', '', 'info', '닫기')
                return false;
            }
            if (this.pwd_val_checker !== this.pwd_cnf_val_checker) {
                $('#pwd_val').addClass('border_validate_err');
                $('#pwd_cnf_val').addClass('border_validate_err');
                this.sweetalert('비밀번호가 일치하지 않습니다.', '', 'info', '닫기')
                return false;
            }
            $('#pwd_cnf_val').removeClass('border_validate_err');

            if (this.name_val_checker === '') {
                $('#name_val').addClass('border_validate_err');
                this.sweetalert('이름을 입력해주세요.', '', 'info', '닫기')
                return false;
            }
            if (this.name_val_checker.search(/\s/) !== -1) {
                $('#name_val').addClass('border_validate_err');
                this.sweetalert('이름에 공백을 제거해 주세요.', '', 'info', '닫기')
                return false;
            }
            $('#niname_val').removeClass('border_validate_err');
            if (this.niname_val_checker === '') {
                $('#niname_val').addClass('border_validate_err');
                this.sweetalert('닉네임을 입력해주세요.', '', 'info', '닫기')
                return false;
            }
            if (this.niname_val_checker.search(/\s/) !== -1) {
                $('#niname_val').addClass('border_validate_err');
                this.sweetalert('닉네임에 공백을 제거해 주세요.', '', 'info', '닫기')
                return false;
            }
            $('#niname_val').removeClass('border_validate_err');
            return true;
        }



        if (this.fnValidate()) {
            this.state.full_email = this.email_val_checker
            axios.post('/api/member/emailCk', {
                email: this.email_val_checker
                
            })
                .then(response => {
                    try {
                        const emailCk = response.data.email;
                        //alert(emailCk);
                        if (emailCk != null) {
                            $('#email_val').addClass('border_validate_err');
                            this.sweetalert('이미 존재하는 이메일입니다.', '', 'info', '닫기')
                        } else {
                            $('#email_val').removeClass('border_validate_err');
                            // this.fnSignInsert('signup', e)
                        }
                    } catch (error) {
                        this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                    }
                })
                .catch(response => { return false; });

                this.setState({ full_niname: this.niname_val_checker });

                axios.post('/api/member/ninameCk', {
                    niname: this.niname_val_checker
                    
                })
                    .then(response => {
                        try {
                            const ninameCk = response.data.niname;
                            alert(ninameCk);
                            if (ninameCk != null) {
                                $('#niname_val').addClass('border_validate_err');
                                this.sweetalert('이미 존재하는 닉네임입니다.', '', 'info', '닫기')
                            } else {
                                $('#niname_val').removeClass('border_validate_err');
                                this.fnSignInsert('signup', e)
                            }
                        } catch (error) {
                            this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                        }
                    })
                    .catch(response => { return false; });
        }

        this.fnSignInsert = async (type, e) => {
            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";

            alert(Json_form);
            var Json_data = JSON.parse(Json_form);

            axios.post('/api/member/register', Json_data)
            .then(response => {
                try {
                    if (response.data == "success") {
                        if (type == 'signup') {
                            this.sweetalertSucc('회원가입 되었습니다.', false)
                        }
                        setTimeout(function () {
                            this.props.history.push('/login');
                        }.bind(this), 1500
                        );
                    }
                }
                catch (error) {
                    alert('1. 작업중 오류가 발생하였습니다.')
                }
            })
            .catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });
        }
    };

    emailKeyPress = (e) => {
        $('#email_val').removeClass('border_validate_err');
    };

    pwdKeyPress = (e) => {
        $('#pwd_val').removeClass('border_validate_err');
    };

    pwdCnfKeyPress = (e) => {
        $('#pwd_cnf_val').removeClass('border_validate_err');
    };

    nameKeyPress = (e) => {
        $('#name_val').removeClass('border_validate_err');
    };
    ninameKeyPress = (e) => {
        $('#niname_val').removeClass('border_validate_err');
    };

    handleSubmit = (e) => {
        e.preventDefault();
    };

    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }
    sweetalertSucc = (title, showConfirmButton) => {
        Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: title,
            showConfirmButton: showConfirmButton,
            timer: 1000
        })
    }

    render() {
        return (
            <div>
                <section className="sub_wrap" >
                    <article className="s_cnt re_1 ct1">
                        <div className="li_top">
                            <h2 className="s_tit1">회원가입</h2>
                            <form method="post" name="frm">
                                <div className="re1_wrap">
                                    <div className="re_cnt ct2">
                                        <table className="table_ty1">
                                            <tr>
                                                <th>이메일</th>
                                                <td>
                                                    <input id="email_val" type="text" name="email"
                                                        placeholder="이메일을 입력해주세요." onKeyPress={this.emailKeyPress} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>비밀번호</th>
                                                <td>
                                                    <input id="pwd_val" type="password" name="pw"
                                                        placeholder="비밀번호를 입력해주세요." onKeyPress={this.pwdKeyPress} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>비밀번호 확인</th>
                                                <td>
                                                    <input id="pwd_cnf_val" type="password"
                                                        placeholder="비밀번호를 다시 입력해주세요." onKeyPress={this.pwdCnfKeyPress} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>이름</th>
                                                <td>
                                                    <input id="name_val" type="text" name="name"
                                                        placeholder="이름을 입력해주세요." onKeyPress={this.nameKeyPress} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>닉네임</th>
                                                <td>
                                                    <input id="niname_val" type="text" name="niname"
                                                        placeholder="닉네임을 입력해주세요." onKeyPress={this.ninameKeyPress} />
                                                </td>
                                            </tr>

                                        </table>
                                    </div>
                                </div>
                                <div className="btn_confirm">
                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass"
                                        onClick={(e) => this.submitClick('signup', e)}>회원가입</a>
                                </div>
                            </form>
                        </div>
                    </article>
                </section>
            </div>
        );
    }
}

export default Register;