import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import $, { data } from 'jquery';
import Swal from 'sweetalert2';
import cookie from 'react-cookies';

class ContentView extends Component {
    constructor(props) {
        super(props);
        this.state = {            
            before_swtcode: props.match.params.bid,
            selectedFile: null,  
            likeCnt: 0,
            like: '',
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
    componentDidMount () {
        var cookie_usernm = cookie.load('niname');
        this.setState({niname2 : cookie_usernm});

        this.callSwToolInfoApi();
        if(this.state.niname !== this.state.niname2){
            $('.modifyclass').hide()
            $('.deleteclass').hide()
        }
        
    }
    

   

    callSwToolInfoApi = async () => {
        axios.post('http://192.168.0.83:8080/api/read', {
            bid: this.state.before_swtcode,
        })
        
        .then( response => {            
            try {
                var data = response.data
                this.setState({title: data.title})
                this.setState({cont: data.cont})
                this.setState({niname: data.niname})
                this.setState({like: data.like})
                this.setState({regdate: data.regdate})
                $('#is_Swt_toolname').val(data.title)
                $('#is_Comments').val(data.cont)
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
        .catch( error => {alert('4. 작업중 오류가 발생하였습니다.');return false;} );
    }
    
    deleteSwtool = (e) => {
        var event_target = e.target
        this.sweetalertDelete('정말 삭제하시겠습니까?', function() {
            axios.post('http://192.168.0.83:8080/api/remove', {
                // bid : this.state.before_swtcode
                bid : event_target.getAttribute('id')
            })
            .then( response => {                
            }).catch( error => {alert('5. 작업중 오류가 발생하였습니다.');return false;} );
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
              setTimeout(function() {
                this.props.history.push('/NBoardList');
                }.bind(this),1500
            );
            }else{
                return false;
            }
            callbackFunc()
          })
    }

    // regeistComent = (e) => {
    //     this.setState({
    //         comment: e.target.value,
    //     });
    // };
    // inputComment = (e) => {
    //     const add = this.state.replies;
    //     add.push(this.state.comment);
    //     this.setState({
    //         replies: this.state.replies,
    //         comment: '',
    //     });
    // };
    // PressClick = (e) => {
    //     this.inputComment();
    // };
    // pressEnter = (e) => {
    //     if (e.key === 'Enter') {
    //         this.inputComment();
    //     }
    // };


   
    submitClick = async (type, e) => {
        this.fnValidate = (e) => {
            if(this.Swt_replies_checker === '') {
                $('#is_Swt_replies').addClass('border_validate_err');
                alert('댓글을 다시 확인해주세요.')
                return false;
            }
            $('#is_Swt_replies').removeClass('border_validate_err');

            return true;
        }
        if(this.fnValidate()){
            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi,'')
            Json_form = "{\"" +Json_form.replace(/\&/g,'\",\"').replace(/=/gi,'\":"')+"\"}";
            alert(Json_form);

            axios.post('http://192.168.0.83:8080/api/replies', Json_form, {
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              .then( response => {
                if( response.data == "succ"){
                        this.sweetalertSucc('등록이 완료되었습니다.', false)
                }
                })
                .catch( error => {alert('2. 작업중 오류가 발생하였습니다.');return false;} )
                
            }
    }
    callrepliesInfoApi = async () => {
        axios.get('http://192.168.0.83:8080/api/replies/all/{this.state.before_swtcode}', {
        })
        
        .then( response => {
            try {
                this.setState({ responseRepliesList: response });
                this.setState({ append_RepliesList: this.RepliesListAppend() });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
        alert(this.state.before_swtcode);
    }

    RepliesListAppend = () => {
        let result = []
        var RepliesList = this.state.responseRepliesList.data
        
        for(let i=0; i<RepliesList.length; i++){
            var data = RepliesList[i]

            result.push(
                <tr>
                    <td>{data.replyer}+": "+{data.replytext}</td>
                    <td>{data.regdate}</td>
                </tr>
            )
        }
        return result
    }



    render () {
        
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
                            <input id="is_replyer" type="hidden" name="replyer" value={this.state.niname2}/>
                            <article class="res_w">
                                
                                <div class="tb_outline">
                                    <table class="table_ty1">
                                        <tr>
                                            <th>
                                                <label for="is_Swt_toolname">작성자<span class="red"></span></label>
                                            </th>
                                            <td>
                                                <div  name="niname" id="is_Swt_toolname" class="">{this.state.niname}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_Swt_toolname">작성일<span class="red"></span></label>
                                            </th>
                                            <td>
                                                <div  name="regdate" id="is_Swt_toolname" class="">{this.state.regdate}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_Swt_toolname">제목<span class="red"></span></label>
                                            </th>
                                            <td>
                                                <div  name="title" id="is_Swt_toolname" class="">{this.state.title}</div>
                                            </td>
                                        </tr>
                                        
                                        <tr>
                                            <th>
                                                <label for="is_Comments">내용<span class="red"></span></label>
                                            </th>
                                            <td>
                                                <div name="cont" id="is_Comments" >{this.state.cont}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_like">좋아요<span class="red"></span></label>
                                            </th>
                                            <td>
                                                {/* <img src={require("../../img/layout/carlogo001.png")} height="30px" width="30px" alt=""/> */}
                                                <div name="like" id="is_like" >
                                                    <span onClick={ ()=> {this.state.like (this.state.likeCnt + 1)} }>❤️</span>
                                                    { this.state.like }
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input type="text" name="replytext" id="is_replies" class="" value={this.state.append_RepliesList} readonly="readonly" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_repliy">댓글</label>
                                            </th>
                                            <td>
                                            
                                                <input type="text" name="replytext" id="is_replies" class="" 
                                                    onChange={this.regeistComent}
                                                    onKeyPress={this.pressEnter}
                                                    // value={this.state.comment}
                                                />
                                                <label className="btn_replies" onClick={(e) => this.submitClick('save', e)}>등록</label>
                                                
                                            </td>
                                        </tr>
                                       
                                       
                                    </table>
                                    <div class="btn_confirm mt20" style={{"margin-bottom": "44px"}}>
                                        <Link to={'/NBoardList'} className="bt_ty bt_ty1 cancel_ty1">목록보기</Link>
                                        <Link to={'/ContentView2/' + this.state.before_swtcode} className="bt_ty bt_ty2 submit_ty1 modifyclass">수정</Link>
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

export default ContentView;