import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import $, { data } from 'jquery';
import Swal from 'sweetalert2';
import cookie from 'react-cookies';
import moment from 'moment';

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
        }
    }
    componentDidMount() {
        var cookie_usernm = cookie.load('niname');
        this.setState({ niname2: cookie_usernm });  // niname2=로그인한 사람
        this.setState({ reply: '' });  // 댓글 입력 필드 초기화
        this.callSwToolInfoApi();
        new Promise(resolve => {
            this.callSwToolInfoApi();
            setTimeout(function () {
                resolve( 'react');
            }, 500);
        }).then(result => {
            if (this.state.niname !== this.state.niname2) {
                $('.modifyclass').hide()
                $('.deleteclass').hide()
            }
        })

        // callrepliesInfoApi 메서드를 호출하도록 추가합니다.
        this.callrepliesInfoApi();
    }

    updateRepliesList = () => {
        this.callrepliesInfoApi();
    };
    callSwToolInfoApi = async () => {
        //alert("this.state.before_swtcode="+this.state.before_swtcode);
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

                    // const formattedDate = moment(data.regdate).format('YYYY.MM.DD HH:mm');
                    // this.setState({ regdate: formattedDate  });
                    
                    $('#is_niname').val(data.niname)
                    $('#is_cont').val(data.cont)
                    $('#is_title').val(data.title)
                    $('#is_like').val(data.likes)


                    // var manualName = data.swt_manual_path.replace('/swmanual/','')
                    // var fileName = data.swt_big_imgpath.replace('/image/','')
                    // var fileName2 = data.swt_imagepath.replace('/image/','')
                    // $('#upload_img').prepend('<img id="uploadimg" src="'+data.swt_big_imgpath+'"/>')
                    // // $('#upload_img2').prepend('<img id="uploadimg2" src="'+data.swt_imagepath+'"/>')

                    // $('#imagefile').val(fileName)
                    // // $('#imagefile2').val(fileName2)
                    // $('#manualfile').val(manualName)

                    // if($('#uploadimg').attr('src').indexOf("null") > -1){
                    //     $('#uploadimg').hide()
                    // }
                    // if($('#uploadimg2').attr('src').indexOf("null") > -1){
                    //     $('#uploadimg2').hide()
                    // }                              
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

    // regeistComent = (e) => {
    //     this.setState({
    //         reply: e.target.value,
    //     });
    // };
    // inputreply = (e) => {
    //     const add = this.state.replies;
    //     add.push(this.state.reply);
    //     this.setState({
    //         replies: this.state.replies,
    //         reply: '',
    //     });
    // };
    // PressClick = (e) => {
    //     this.inputreply();
    // };
    // pressEnter = (e) => {
    //     if (e.key === 'Enter') {
    //         this.inputreply();
    //     }
    // };

    updateRepliesList = () => {
        this.callrepliesInfoApi();
    };
    componentDidUpdate(prevProps, prevState) {

        if (prevState.replies !== this.state.replies) {
            console.log('댓글 목록이 갱신되었습니다.');
        }
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
            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            // alert(Json_form);

            var Json_data = JSON.parse(Json_form);

            axios.post('/api/replies', Json_data)
                .then(response => {
                    try {
                        if (response.data === "succ") {
                            if (type === 'save') {
                                this.sweetalertSucc('등록되었습니다.', false);
                            }
                            // 댓글 등록 후 댓글 목록을 다시 불러오기
                            this.callrepliesInfoApi();
                        }
                    } catch (error) {
                        alert('1. 작업중 오류가 발생하였습니다.');
                    }
                })
                .catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); });
        }
    }



    RepliesListAppend = () => {
        let result = [];
        var RepliesList = this.state.responseRepliesList.data;

        for (let i = 0; i < RepliesList.length; i++) {
            var data = RepliesList[i];

            result.push(
                <tr key={i}>
                    <td>{data.replyer}           :        {data.replytext}</td>
                </tr>
            );
        }

        console.log(RepliesList);
        return result;
    }


    callrepliesInfoApi = async () => {
        axios.get(`/api/replies/all/${this.state.before_swtcode}`)
            .then(response => {
                try {
                    this.setState({ responseRepliesList: response });
                    this.setState({ append_RepliesList: this.RepliesListAppend() });
                } catch (error) {
                    alert('작업중 오류가 발생하였습니다.');
                }
            })
            .catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });
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
            <section className="sub_wrap">
                <article className="s_cnt mp_pro_li ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">글보기</h2>
                    </div>
                    <div className="bo_w re1_wrap re1_wrap_writer">
                        <form name="frm" id="frm" action="" onSubmit="" method="post">
                            <input id="is_Email" type="hidden" name="is_Email" value="guest" />
                            <input id="is_beforeSwtcode" type="hidden" name="bid" value={this.state.before_swtcode} />
                            <input id="is_replyer" type="hidden" name="replyer" value={this.state.niname2} />
                            <article class="res_w">

                                <div class="tb_outline">
                                    <table class="table_ty1">
                                        <tr>
                                            <th>
                                                <label for="is_niname">작성자<span class="red"></span></label>
                                            </th>
                                            <td>
                                                {/* <div  name="niname" id="is_Swt_toolname" class="">{this.state.niname}</div> */}
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
                                                {/* <img src={require("../../img/layout/carlogo001.png")} height="30px" width="30px" alt=""/> */}
                                                <div name="likes" id="is_like" >
                                                    <span onClick={(e) => this.likeSwtool('like', e)}>❤️</span>
                                                    {this.state.likes}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                            </th>
                                            <td>
                                                <table>
                                                    <tbody>

                                                        {this.updateRepliesList}

                                                        {this.state.append_RepliesList}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_replies">댓글</label>
                                            </th>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="replytext"
                                                    id="is_replies"
                                                    class=""
                                                />
                                                <button className="btn_replies" onClick={(e) => this.submitClick('save', e)}>등록</button>
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