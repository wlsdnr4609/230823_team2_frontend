import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import $ from 'jquery';
import cookie from 'react-cookies';

class ReRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseSwtoolList: '',
            append_SwtoolList: '',
            before_swtcode: props.match.params.mid,

            selectedFile: null,
            email: '',   //로그인한 이메일
            name: '',
            niname: '',
            mid: '',
            pw: '',
            full_niname: '',
        }
    }
    componentDidMount = async () => {

        var cookie_usernm = await cookie.load('niname')
        var cookie_userid = await cookie.load('email')
        var cookie_userpw = await cookie.load('pw')
        this.setState({ niname: cookie_usernm })
        this.setState({ email: cookie_userid })
        this.setState({ pw: cookie_userpw })

        this.callSwToolInfoApi()
    }


    callSwToolInfoApi = async () => {

        //alert("this.state.before_swtcode="+this.state.before_swtcode);
        axios.post('/api/member/readMember', {
            email: this.state.email,
        })
            .then(response => {
                try {
                    var data = response.data
                    this.setState({ niname: data.niname })
                    this.setState({ name: data.name })
                    this.setState({ mid: data.mid })
                    $('#is_niname').val(data.niname)
                }
                catch (error) {
                    alert('3. 작업중 오류가 발생하였습니다.')
                }
            })
            .catch(error => { alert('4. 작업중 오류가 발생하였습니다.'); return false; });
    }

    submitClick = async (type, e) => {
        this.pwd_val_checker = $('#pwd_val').val();
        this.pwd_cnf_val_checker = $('#pwd_cnf_val').val();
        // this.name_val_checker = $('#name_val').val();
        this.niname_val_checker = $('#niname_val').val();

        this.fnValidate = (e) => {
            var pattern1 = /[0-9]/;
            var pattern2 = /[a-zA-Z]/;
            var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

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
            return true;
        }

        if (this.fnValidate()) {
            this.setState({ full_niname: this.niname_val_checker })
            //this.state.full_niname = this.niname_val_checker
            this.state.niname = this.niname_val_checker
            axios.post('/api/member/ninameCk', {
                niname: this.niname_val_checker
            })
                .then(response => {
                    try {
                        const ninameCk = response.data.niname;
                        alert("ninameCk: " + response.data.niname);
                        if (ninameCk != null) {
                            $('#niname_val').addClass('border_validate_err');
                            this.sweetalert('이미 존재하는 닉네임입니다.', '', 'info', '닫기')
                        } else {
                            $('#niname_val').removeClass('border_validate_err');
                            this.fnSignInsert('modify', e)
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
            // alert("1: " + Json_form);
            var Json_data = JSON.parse(Json_form);

            await axios.post('/api/member/modifyMember', Json_data)
                .then(response => {
                    try {
                        if (response.data == "SUCCESS") {
                            if (type == 'modify') {
                                this.sweetalertSucc('수정되었습니다.', false)
                            }
                            setTimeout(function () {
                                cookie.remove('email', { path: '/' });
                                cookie.remove('niname', { path: '/' });
                                cookie.remove('pw', { path: '/' });
                                window.location.href = '/login';
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

    mustNumber = (id) => {
        var pattern1 = /[0-9]/;
        var str = $('#' + id).val();
        if (!pattern1.test(str.substr(str.length - 1, 1))) {
            $('#' + id).val(str.substr(0, str.length - 1));
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
    sweetalertSucc = (title, showConfirmButton) => {
        Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: title,
            showConfirmButton: showConfirmButton,
            timer: 1000
        })
    }

    deleteSwtool = (e) => {
        var event_target = e.target
        this.sweetalertDelete('정말 탈퇴하시겠습니까?', function () {
            axios.post('/api/member/deleteMember', {
                email: this.state.email
                // mid: this.state.mid
            })
                .then(response => {
                }).catch(error => { alert('5. 작업중 오류가 발생하였습니다.'); return false; });
        }.bind(this))
        alert("email: " + this.state.email)
    }

    sweetalertDelete = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                Swal.fire(
                    'Deleted!',
                    '탈퇴되었습니다.',
                    'success'
                )
                setTimeout(function () {
                    this.props.history.push('/MainForm');
                }.bind(this), 1500
                );

                cookie.remove('email', { path: '/' });
                cookie.remove('niname', { path: '/' });
                cookie.remove('pw', { path: '/' });
                window.location.href = '/MainForm';
            } else {
                return false;
            }
            callbackFunc()
        })
    }

    render() {
        return (
            <div>
                <section className="sub_wrap" >
                    <article className="s_cnt re_1 ct1">
                        <div className="li_top">
                            <h2 className="s_tit1">내정보수정</h2>
                            <form method="post" name="frm">
                                <div className="re1_wrap">
                                    <div className="re_cnt ct2">
                                        <table className="table_ty1">
                                            <tr className="re_email">
                                                <th>이메일</th>
                                                <td>
                                                    <input name="email" id="email_val" class="" readOnly="readonly" value={this.state.email} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>이름</th>
                                                <td>
                                                    <input name="name" id="name_va" class="" readOnly="readonly" value={this.state.name} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>닉네임</th>
                                                <td>
                                                    <input id="niname_val" type="text" name="niname" placeholder={this.state.niname}
                                                        onKeyPress={this.ninameKeyPress} />
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
                                        </table>
                                    </div>
                                </div>
                                <div className="btn_confirm">
                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass"
                                        onClick={(e) => this.submitClick('modify', e)}>수정</a>

                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 deleteclass" id={this.state.email}
                                        onClick={(e) => this.deleteSwtool('delete', e)}>탈퇴</a>
                                </div>
                            </form>
                        </div>
                    </article>
                </section>
            </div>
        );
    }
}

export default ReRegister;