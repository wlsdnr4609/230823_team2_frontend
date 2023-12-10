import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import $, { data } from 'jquery';
import Swal from 'sweetalert2';
import cookie from 'react-cookies';

class RContentView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            before_swtcode: props.match.params.bid,
            selectedFile: null,
            likeCnt: '',
            likes: '',
            reply: '',
            replies: [],
            title: '',
            cont: '',
            niname: '',  //글작성자
            regdate: '',
            niname2: '', //로그인한 닉네임
            bid: '',
            responseRepliesList: '',
            append_RepliesList: '',
            replyer: '',
            replytext: '',
            btype: '',

        }
        //alert(this.state.before_swtcode )
    }
    componentDidMount() {
        var cookie_usernm = cookie.load('niname')
        this.setState({ niname2: cookie_usernm })  //niname2=로그인한 사람
        this.setState({ replyer: cookie_usernm })

        new Promise(resolve => {
            this.callSwToolInfoApi();
            setTimeout(function () {
                resolve('react');
            }, 500);
        }).then(result => {
            if (this.state.niname !== this.state.niname2) {
                $('.modifyclass').hide()
                $('.deleteclass').hide()
            }
        })
    }

    callSwToolInfoApi = async () => {
        axios.post('/api/read', {
            bid: this.state.before_swtcode,
        })
            .then(response => {
                try {
                    var data = response.data
                    this.setState({ title: data.title })
                    this.setState({ cont: data.cont })
                    this.setState({ niname: data.niname })
                    this.setState({ likes: data.likes })
                    this.setState({ regdate: data.regdate })
                    $('#is_niname').val(data.niname)
                    $('#is_cont').val(data.cont)
                    $('#is_title').val(data.title)
                    $('#is_like').val(data.likes)
                }
                catch (error) {
                    alert('3. 작업중 오류가 발생하였습니다.')
                }
            })
            .catch(error => { alert('4. 작업중 오류가 발생하였습니다.'); return false; });
    }

    deleteSwtool = (e) => {
        var event_target = e.target
        this.sweetalertDelete('정말 삭제하시겠습니까?', function () {
            axios.post('/api/remove', {
                bid: this.state.before_swtcode,
            })
                .then(response => {
                }).catch(error => { alert('5. 작업중 오류가 발생하였습니다.'); return false; });
        }.bind(this))
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
                    '삭제되었습니다.',
                    'success'
                )
                setTimeout(function () {
                    this.props.history.push('/RBoardList');
                }.bind(this), 1500
                );
            } else {
                return false;
            }
            callbackFunc()
        })
    }

    submitClick = async (type, e) => {
        this.replies_val_checker = $('#is_replies').val();

        this.fnValidate = (e) => {
            if (this.replies_val_checker === '') {
                $('#is_replies').addClass('border_validate_err');
                alert('댓글을 다시 확인해주세요.')
                return false;
            }
            $('#is_replies').removeClass('border_validate_err');
            return true;
        }
        if (this.fnValidate()) {
            var jsonstr = $("form[name='replytext']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            alert(Json_form);

            axios.post('/api/replies', Json_form, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    try {
                        if (response.data == "success") {
                            if (type == 'save') {
                                this.sweetalertSucc('등록되었습니다.', false)
                            }
                            setTimeout(function() {
                                this.props.history.push('/RBoardList');
                                }.bind(this),1500
                            );
                            // setTimeout(function () {
                            //     if (this.btype == 'F') {
                            //         this.props.history.push('/FBoardList');
                            //         return false;
                            //     }
                            //     if (this.btype == 'N') {
                            //         this.props.history.push('/NBoardList');
                            //         return false;
                            //     }
                            //     if (this.btype ==='R') {
                            //         this.props.history.push('/RBoardList');
                            //         return false;
                            //     }
                            //     if (this.btype == 'Q') {
                            //         this.props.history.push('/QBoardList');
                            //         return false;
                            //     }
                            //     return true;
                            // }.bind(this), 1500
                            // );
                        }
                    }
                    catch (error) {
                        alert('1. 작업중 오류가 발생하였습니다.')
                    }
                })
                .catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });
            this.callRepliesInfoApi();
        }
    }

    callRepliesInfoApi = async () => {
        try {
            const response = await axios.get('/api/replies/all/{ this.state.before_swtcode}', {
            });

            this.setState({ responseRepliesList: response.data });
            this.setState({ append_RepliesList: this.repliesListAppend() });

            alert("bid: " + this.state.before_swtcode);
            alert("responseRepliesList: " + JSON.stringify(this.state.responseRepliesList));
        } catch (error) {
            alert('작업 중 오류가 발생하였습니다.');
        }
    };


    // callrepliesInfoApi = async () => {
    //     try {
    //       // Use await here to wait for the completion of the asynchronous operation
    //       const response = await axios.post('/api/replies/all', {
    //         bid: this.state.before_swtcode,
    //       });

    //       // Set state using response data (use response.data)
    //       this.setState({ responseRepliesList: response.data });

    //       // Call RepliesListAppend and set state (assuming RepliesListAppend returns some value)
    //       this.setState({ append_RepliesList: this.RepliesListAppend() });

    //       // These alerts will run after the asynchronous operations are complete
    //       alert("bid: " + this.state.before_swtcode);
    //       alert("responseRepliesList: " + JSON.stringify(this.state.responseRepliesList));
    //     } catch (error) {
    //       // Handle errors
    //       alert('작업 중 오류가 발생하였습니다.');
    //     }
    //   };

    repliesListAppend = () => {
        let result = []
        var RepliesList = this.state.responseRepliesList.data

        for (let i = 0; i < RepliesList.length; i++) {
            var data = RepliesList[i]

            result.push(
                <tr>
                    <td>{data.replyer}: {data.replytext}</td>
                </tr>
            )
        } alert(RepliesList.data);
        return result
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

    likeSwtool = async (type, e) => {
        var likeCnt = this.state.likes + 1;
        axios.post('/api/likes', {
            bid: this.state.before_swtcode,
            likes: likeCnt
        })
        this.callSwToolInfoApi();
    }

    render() {
        return (
            <section class="sub_wrap">
                <article class="s_cnt mp_pro_li ct1">
                    <div class="li_top">
                        <h2 class="s_tit1">글보기</h2>
                    </div>
                    <div class="bo_w re1_wrap re1_wrap_writer">
                        <form name="frm" id="frm" action="" onsubmit="" method="post" >
                            <input id="is_Swtcode" type="hidden" name="is_Swtcode" />
                            <input id="is_Email" type="hidden" name="is_Email" value="guest" />
                            <input id="is_beforeSwtcode" type="hidden" name="bid" value={this.state.before_swtcode} />
                            <article class="res_w">
                                <div class="tb_outline">
                                    <table class="table_ty1">
                                        <tr>
                                            <th>
                                                <label for="is_niname">작성자<span class="red"></span></label>
                                            </th>
                                            <td>
                                                <input type="text" id="is_niname" name="niname" class="" value={this.state.niname} readonly="readonly" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_regdate">작성일<span class="red"></span></label>
                                            </th>
                                            <td>
                                                <input type="text" name="regdate" id="is_regdate" class="" value={this.state.regdate} readonly="readonly" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_title">제목<span class="red"></span></label>
                                            </th>
                                            <td>
                                                <input type="text" name="title" id="is_title" class="" value={this.state.title} readonly="readonly" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_cont">내용<span class="red"></span></label>
                                            </th>
                                            <td>
                                                <textarea name="cont" id="is_Comments" rows="" cols="" value={this.state.cont} readonly="readonly"></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_like"><span class="red"></span></label>
                                            </th>
                                            <td>
                                                <div name="likes" id="is_like" className="likes_bt">
                                                    <span className="likes_bt" onClick={(e) => this.likeSwtool('likes', e)}>❤️</span>
                                                    {this.state.likes}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                            </th>
                                            <td>
                                                <div>{this.state.append_RepliesList}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_replies">댓글</label>
                                            </th>
                                            <td>
                                                <form name="replytext" >
                                                    <input id="is_beforeSwtcode" type="hidden" name="bid" value={this.state.before_swtcode} />
                                                    <input id="is_replyer" type="hidden" name="replyer" value={this.state.niname2} />
                                                    <input type="text" name="replytext" id="is_replies" class=""
                                                        onChange={this.regeistComent}
                                                        onKeyPress={this.pressEnter}
                                                    // value={this.state.reply}
                                                    />
                                                    <button className="btn_replies" onClick={(e) => this.submitClick('save', e)}>등록</button>
                                                </form>
                                            </td>
                                        </tr>
                                    </table>
                                    <div class="btn_confirm mt20" style={{ "margin-bottom": "44px" }}>
                                        <Link to={'/RBoardList'} className="bt_ty bt_ty1 cancel_ty1">목록보기</Link>
                                        <Link to={'/RContentView2/' + this.state.before_swtcode} className="bt_ty bt_ty2 submit_ty1 modifyclass">수정</Link>
                                        <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 deleteclass" id={this.state.before_swtcode}
                                            onClick={(e) => this.deleteSwtool('delete', e)}>삭제</a>
                                    </div>
                                </div>
                            </article>
                        </form>
                    </div>
                </article>
            </section>
        );
    }
}

export default RContentView;